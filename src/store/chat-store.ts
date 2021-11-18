import { makeAutoObservable } from 'mobx'
import { Dialog, Message } from '../types/chat'
import { ACCESS_TOKEN } from './user-store'
import { RootStore } from './root-store'
import { queryClient } from '../index'
import { DIALOGS } from '../api/dialogs'
import { scrollToBottom } from '../functions/scrollToBottom'


type WebsocketEvent =
  { type: 'send_message', dialog: number, text: string } |
  { type: 'load_messages', dialog: number, page: number }

export class ChatStore {
  root: RootStore

  socket: WebSocket = null as any

  messages: Message[] = []
  currentDialog: null | Dialog = null

  currentPage = 1
  totalPages: null | number = null
  isLoading = false
  mayToLoadMore = false


  constructor(root: RootStore) {
    this.root = root
    makeAutoObservable(this)
  }

  setCurrentDialog(dialog: Dialog | null | undefined) {
    if (dialog) {
      this.currentDialog = dialog
      this.currentPage = 1
      this.totalPages = null
      this.messages = []
      this.mayToLoadMore = false
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

  openChat = () => {
    this.socket?.close()
    this.socket = new WebSocket(`ws://127.0.0.1:8000/chat/?token=${localStorage.getItem(ACCESS_TOKEN)}`)
    this.socket.addEventListener('message', e => {
      const data = JSON.parse(e.data)

      const actions: any = {
        receive_message: () => this.handleReceiveMessage(data.message),
        loaded_messages: () => this.handleLoadedMessages(data.messages, data.page, data.total_pages)
      }

      actions[data.type]?.()
    })
  }

  sendMessage = (text: string) => this.sendEvent({
    type: 'send_message',
    dialog: this.currentDialog!.id,
    text
  })

  loadMessages = () => {
    this.isLoading = true
    this.sendEvent({
      type: 'load_messages',
      dialog: this.currentDialog!.id,
      page: this.currentPage
    })
  }

  private sendEvent = (event: WebsocketEvent) => this.socket.send(JSON.stringify(event))

  private handleReceiveMessage = (message: Message) => {
    if (message.dialog === this.currentDialog?.id) {
      this.messages.unshift(message)
      setTimeout(scrollToBottom, 0)
      return
    }

    const oldDialogs = queryClient.getQueryData<Dialog[]>(DIALOGS) || []
    const updatedDialog = oldDialogs.find(d => d.id)

    if (updatedDialog) {
      return queryClient.setQueryData(DIALOGS, [{...updatedDialog, last_message: message}, ...oldDialogs])
    }

    queryClient.fetchQuery(DIALOGS).then()
  }

  private handleLoadedMessages = (messages: Message[], page: number, totalPages: number) => {
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

  closeChat = () => this.socket.close()
}

