import { makeAutoObservable, runInAction } from 'mobx'
import { Dialog, Message } from '../types/chat'
import { ACCESS_TOKEN } from './user-store'


type WebsocketEvent =
  { type: 'send_message', dialog: number, text: string } |
  { type: 'load_messages', dialog: number }

class ChatStore {
  socket: WebSocket = null as any
  messages: Message[] = []
  currentDialog = null as null | Dialog

  constructor() {
    makeAutoObservable(this)
  }

  sendEvent = (event: WebsocketEvent) => this.socket.send(JSON.stringify(event))

  setCurrentDialog(dialog: Dialog | null | undefined) {
    this.currentDialog = dialog || null
  }

  openChat = () => {
    this.socket = new WebSocket(`ws://127.0.0.1:8000/chat/?token=${localStorage.getItem(ACCESS_TOKEN)}`)
    this.socket.addEventListener('message', e => {
      const data = JSON.parse(e.data)

      const actions = {
        receive_message: () => runInAction(() => this.messages.push(data.message)),
        loaded_messages: () => runInAction(() => this.messages = data.messages)
      } as any

      actions[data.type]?.()
    })
  }

  sendMessage = (text: string) => {
    this.sendEvent({
      type: 'send_message',
      dialog: this.currentDialog!.id,
      text
    })
  }

  loadMessages = () => {
    this.sendEvent({type: 'load_messages', dialog: this.currentDialog!.id})
  }

  closeChat = () => this.socket.close()
}

export const chatStore = new ChatStore()
