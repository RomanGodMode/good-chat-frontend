import { action, makeAutoObservable, runInAction, when } from 'mobx'
import { Message, NewMessage } from '../types/chat'
import { isTypingStore, rootStore, RootStore, userStore } from './root-store'
import { chatApi } from '../api/chats'
import { scrollToBottom } from '../functions/scrollToBottom'
import { groupBy } from '../functions/group-by'
import { trimSeconds } from '../functions/trimSeconds'
import { pushIfNot } from '../functions/actions/push-if-not'
import { wait } from '../functions/wait'
import { remove } from '../functions/actions/remove'


export class ChatStore {
  root: RootStore

  messages: Message[] = []
  currentDialogId: null | number = null
  currentGroupId: null | number = null

  currentPage = 1
  totalPages: null | number = null
  isLoading = false
  mayToLoadMore = false

  newMessagesCount = 0


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

  get currentDialog() {
    if (!this.currentDialogId) {
      return null
    }
    return this.root.dialogStore.dialogs.find(dialog => dialog.id === this.currentDialogId)
  }

  get currentGroup() {
    if (!this.currentGroupId) {
      return null
    }
    return this.root.groupStore.groups.find(group => group.id === this.currentGroupId)
  }

  setCurrentChat({dialog, group}: { dialog?: number, group?: number }) {
    if (dialog || group) {
      this.currentPage = 1
      this.totalPages = null
      this.messages = []
      this.mayToLoadMore = false
      this.newMessagesCount = 0
    }
    if (dialog) {
      this.currentDialogId = dialog
      this.currentGroupId = null
      this.sendLoadMessages().then()
      return
    }
    if (group) {
      this.currentGroupId = group
      this.currentDialogId = null
      this.sendLoadMessages().then()
    }
  }

  unsetChat() {
    this.currentDialogId = null
    this.currentGroupId = null
  }

  attemptNextPage() {
    if (
      !this.isLoading &&
      this.currentPage < (this.totalPages || 0) &&
      this.messages.length &&
      this.mayToLoadMore
    ) {
      this.currentPage++
      this.sendLoadMessages().then()
    }
  }

  sendMessage = (text: string) => this.currentDialog
    ? this.root.websocketStore.sendEvent({
      type: 'send_message',
      dialog: this.currentDialog!.id,
      text
    })
    : this.root.websocketStore.sendEvent({
      type: 'send_message',
      group: this.currentGroup!.id,
      text
    })

  sendMarkAsRead = (data: { dialogId: number } | { groupId: number }) => 'dialogId' in data
    ? this.root.websocketStore.sendEvent({type: 'mark_as_read', dialog_id: data.dialogId})
    : this.root.websocketStore.sendEvent({type: 'mark_as_read', group_id: data.groupId})

  async sendLoadMessages() {
    await when(() => this.root.chatsListStore.isLoaded)
    runInAction(() => this.isLoading = true)
    this.currentDialog
      ? this.root.websocketStore.sendEvent({
        type: 'load_messages',
        dialog: this.currentDialog.id,
        page: this.currentPage,
        shift: this.newMessagesCount
      })
      : this.currentGroup && this.root.websocketStore.sendEvent({
      type: 'load_messages',
      group: this.currentGroup.id,
      page: this.currentPage,
      shift: this.newMessagesCount
    })
  }


  async handleReceiveMessage(message: NewMessage) {
    const isDialog = 'dialog' in message

    isTypingStore.handleSomeoneStopTyping(
      message.sender.id
      , isDialog
        ? {dialog: message.dialog}
        : {group: message.group}
    )

    if (message.sender.id === userStore.user?.id) {
      this.root.isTypingStore.isTyping = false
    }

    const isCurrentChatMessage = isDialog
      ? message.dialog === this.currentDialog?.id
      : message.group === this.currentGroup?.id

    if (isCurrentChatMessage) {
      this.messages.unshift(message)
      this.newMessagesCount++
      setTimeout(scrollToBottom, 0)
      if (message.sender.id !== this.root.userStore.user?.id) {
        this.sendMarkAsRead(isDialog ? {dialogId: this.currentDialog!.id} : {groupId: this.currentGroup!.id})
      }
      return
    }

    const chats = this.root.chatsListStore.chats

    const updatedChat = isDialog
      ? chats.find(d => d.id === message.dialog)
      : chats.find(d => d.id === message.group)

    if (updatedChat) {
      action('removeUpdatedChat', remove)(chats, updatedChat)
      updatedChat.last_message = message
      chats.unshift(updatedChat)
      return
    }

    if (isDialog) {
      this.root.chatsListStore.addChat(await chatApi.getDialog(message.dialog))
    }
  }

  handleLoadedMessages(messages: Message[], page: number, totalPages: number) {
    this.messages.push(...messages)
    // gigaLog(this.messages)
    this.currentPage = page
    this.totalPages = totalPages
    this.isLoading = false

    page === 1 && setTimeout(() => {
      scrollToBottom()
      setTimeout(() => this.mayToLoadMore = true, 0)
    }, 0)

    if (page > 1 && window.scrollY === 0 && !this.isLoading) {
      this.attemptNextPage()
      window.scrollTo({top: 150, behavior: 'auto'})
    }
  }

  async handleReadMessages(data: { dialog_id: number, user_id: number } | { group_id: number, user_id: number }) {
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

    const chats = rootStore.chatsListStore.chats
    if (isDialog) {
      const dialog = chats.find(c => 'initiator' in c && c.id === data.dialog_id)
      pushIfNot(dialog!.last_message!.users_that_read, data.user_id)
      return
    }
    const group = chats.find(c => 'creator' in c && c.id === data.group_id)
    pushIfNot(group!.last_message!.users_that_read, data.user_id)
  }

}

