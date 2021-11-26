import { makeAutoObservable } from 'mobx'
import { Chat, Dialog, Group, Message, NewMessage } from '../types/chat'
import { ACCESS_TOKEN } from './user-store'
import { RootStore } from './root-store'
import { queryClient } from '../index'
import { chatApi, CHATS } from '../api/chats'
import { scrollToBottom } from '../functions/scrollToBottom'
import { USERS } from '../api/users'
import { updateLastMessage } from '../functions/update-last-message'


type WebsocketEvent =
  { type: 'send_message', dialog: number, text: string } |
  { type: 'send_message', group: number, text: string } |
  { type: 'load_messages', dialog: number, page: number } |
  { type: 'load_messages', group: number, page: number } |
  // { type: 'subscribe_for_new_dialog', dialog: number } |
  { type: 'initiate_dialog', dialog: { answerer: number } }

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
      return this.loadMessages()
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

  openChat() {
    this.socket?.close()
    this.socket = new WebSocket(`ws://127.0.0.1:8000/chat/?token=${localStorage.getItem(ACCESS_TOKEN)}`)
    this.socket.addEventListener('message', e => {
      const data = JSON.parse(e.data)

      const actions: any = {
        'receive_message': () => this.handleReceiveMessage(data.message),
        'loaded_messages': () => this.handleLoadedMessages(data.messages, data.page, data.total_pages),
        'initiate_dialog_success': () => this.handleInitiateDialogSuccess(data.created_dialog)
      }

      actions[data.type]?.()
    })
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

  initiateDialog = (answerer: number) => this.sendEvent({type: 'initiate_dialog', dialog: {answerer}})

  loadMessages() {
    this.isLoading = true
    this.currentDialog
      ? this.sendEvent({
        type: 'load_messages',
        dialog: this.currentDialog.id,
        page: this.currentPage
      })
      : this.sendEvent({
        type: 'load_messages',
        group: this.currentGroup!.id,
        page: this.currentPage
      })
  }

  private sendEvent = (event: WebsocketEvent) => this.socket.send(JSON.stringify(event))

  onInitiateDialogSuccess = (createdDialog: Dialog) => {
  }

  setOnInitiateDialogSuccess = (handle: (createdDialog: Dialog) => void) => this.onInitiateDialogSuccess = handle

  private async handleReceiveMessage(message: NewMessage) {
    const isDialog = 'dialog' in message

    const isCurrentChatMessage = isDialog
      ? message.dialog === this.currentDialog?.id
      : message.group === this.currentGroup?.id

    if (isCurrentChatMessage) {
      this.messages.unshift(message)
      setTimeout(scrollToBottom, 0)
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
      this.addDialog(await chatApi.getDialog(message.dialog))
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

    if (window.scrollY === 0) {
      this.attemptNextPage()
      window.scrollTo({top: 150})
    }
  }

  private handleInitiateDialogSuccess(createdDialog: Dialog) {
    this.addDialog(createdDialog)
    this.onInitiateDialogSuccess(createdDialog)
  }

  // private handleOnNewDialog(newDialog: Dialog) {
  //
  // }


  private addDialog(dialog: Dialog) {
    const oldDialogs = queryClient.getQueryData<Dialog[]>(CHATS) || []
    queryClient.setQueryData(CHATS, [dialog, ...oldDialogs])
    queryClient.invalidateQueries(USERS).then()
  }

  closeChat = () => this.socket.close()
}

