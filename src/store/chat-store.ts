import { makeAutoObservable } from 'mobx'
import { Chat, Dialog, Group, Message, NewMessage } from '../types/chat'
import { ACCESS_TOKEN } from './user-store'
import { RootStore } from './root-store'
import { queryClient } from '../index'
import { chatApi, CHATS } from '../api/chats'
import { scrollToBottom } from '../functions/scrollToBottom'
import { updateLastMessage } from '../functions/update-last-message'
import { groupBy } from '../functions/group-by'
import { trimSeconds } from '../functions/trimSeconds'
import { pushIfNot } from '../functions/push-if-not'
import { wait } from '../functions/wait'


type WebsocketEvent =
  { type: 'send_message', dialog: number, text: string } |
  { type: 'send_message', group: number, text: string } |
  { type: 'load_messages', dialog: number, page: number } |
  { type: 'load_messages', group: number, page: number } |
  { type: 'add_to_group', user: number, group: number } |
  { type: 'mark_as_read', dialog_id: number } |
  { type: 'mark_as_read', group_id: number }

export class ChatStore {
  root: RootStore

  socket: WebSocket = null as any

  messages: Message[] = []
  currentDialog: null | Dialog = null
  currentGroup: null | Group = null

  currentPage = 1
  totalPages: null | number = null
  isLoading = false
  mayToLoadMore = false


  constructor(root: RootStore) {
    this.root = root
    makeAutoObservable(this, {}, {autoBind: true})
  }

  get groupedMessages() {
    return groupBy(this.messages, message => ({
      username: message.sender.username,
      moment: trimSeconds(message.sent_at)
    }))
  }

  setCurrentChat({dialog, group}: { dialog?: Dialog, group?: Group }) {
    if (dialog || group) {
      this.currentPage = 1
      this.totalPages = null
      this.messages = []
      this.mayToLoadMore = false
    }
    if (dialog) {
      this.currentDialog = dialog
      this.currentGroup = null
      this.loadMessages()
      return
    }
    if (group) {
      this.currentGroup = group
      this.currentDialog = null
      this.loadMessages()
    }
  }

  attemptNextPage() {
    if (
      !this.isLoading &&
      this.currentPage < (this.totalPages || 0) &&
      this.messages.length &&
      this.mayToLoadMore
    ) {
      this.currentPage++
      this.loadMessages()
    }
  }

  unsetChat() {
    this.currentDialog = null
    this.currentGroup = null
  }

  sendMessage = (text: string) => this.currentDialog
    ? this.sendEvent({
      type: 'send_message',
      dialog: this.currentDialog!.id,
      text
    })
    : this.sendEvent({
      type: 'send_message',
      group: this.currentGroup!.id,
      text
    })

  openChat() {
    this.socket?.close()
    this.socket = new WebSocket(`ws://127.0.0.1:8000/chat/?token=${localStorage.getItem(ACCESS_TOKEN)}`)
    this.socket.addEventListener('message', e => {
      const data = JSON.parse(e.data)

      const actions: any = {
        'receive_message': () => this.handleReceiveMessage(data.message),
        'loaded_messages': () => this.handleLoadedMessages(data.messages, data.page, data.total_pages),
        'added_to_group': () => this.root.groupStore.handleAddedToGroup(data.group, data.user_id),
        'read_messages': () => this.handleReadMessages(data)
      }

      actions[data.type]?.()
    })
  }

  markAsRead = (data: { dialogId: number } | { groupId: number }) => 'dialogId' in data
    ? this.sendEvent({type: 'mark_as_read', dialog_id: data.dialogId})
    : this.sendEvent({type: 'mark_as_read', group_id: data.groupId})

  loadMessages() {
    this.isLoading = true
    this.currentDialog
      ? this.sendEvent({
        type: 'load_messages',
        dialog: this.currentDialog.id,
        page: this.currentPage
      })
      : this.currentGroup && this.sendEvent({
      type: 'load_messages',
      group: this.currentGroup!.id,
      page: this.currentPage
    })
  }

  sendEvent = (event: WebsocketEvent) => this.socket.send(JSON.stringify(event))

  private async handleReceiveMessage(message: NewMessage) {
    const isDialog = 'dialog' in message

    const isCurrentChatMessage = isDialog
      ? message.dialog === this.currentDialog?.id
      : message.group === this.currentGroup?.id

    if (isCurrentChatMessage) {
      this.messages.unshift(message)
      setTimeout(scrollToBottom, 0)
      if (message.sender.id !== this.root.userStore.user?.id) {
        this.markAsRead(isDialog ? {dialogId: this.currentDialog!.id} : {groupId: this.currentGroup!.id})
      }
      return
    }

    const oldChats = queryClient.getQueryData<Chat[]>(CHATS) || []
    const updatedChat = isDialog
      ? oldChats.find(d => d.id === message.dialog)
      : oldChats.find(d => d.id === message.group)

    if (updatedChat) {
      return queryClient.setQueryData(CHATS, updateLastMessage(oldChats, updatedChat, message))
    }

    if (isDialog) {
      this.root.dialogStore.addChat(await chatApi.getDialog(message.dialog))
    }
  }

  private handleLoadedMessages(messages: Message[], page: number, totalPages: number) {
    this.messages.push(...messages)
    this.currentPage = page
    this.totalPages = totalPages
    this.isLoading = false

    page === 1 && setTimeout(() => {
      scrollToBottom()
      setTimeout(() => this.mayToLoadMore = true, 0)
    }, 0)

    if (page > 1 && window.scrollY === 0 && !this.isLoading) {
      this.attemptNextPage()
      window.scrollTo({top: 150, behavior: 'smooth'})
    }
  }

  private async handleReadMessages(data: { dialog_id: number, user_id: number } | { group_id: number, user_id: number }) {
    const isDialog = 'dialog_id' in data

    const isCurrentChat = isDialog
      ? data.dialog_id === this.currentDialog?.id
      : data.group_id === this.currentGroup?.id

    if (isCurrentChat) {
      if (data.user_id === this.root.userStore.user?.id) {
        await wait(5000)
      }
      this.messages.forEach(m => pushIfNot(m.users_that_read, data.user_id))
      return
    }

    const chats = queryClient.getQueryData<Chat[]>(CHATS) || []
    if (isDialog) {
      const dialog = chats.find(c => 'initiator' in c && c.id === data.dialog_id)
      pushIfNot(dialog!.last_message!.users_that_read, data.user_id)
      return
    }
    const group = chats.find(c => 'creator' in c && c.id === data.group_id)
    pushIfNot(group!.last_message!.users_that_read, data.user_id)
  }

  closeChat = () => this.socket.close()

}

