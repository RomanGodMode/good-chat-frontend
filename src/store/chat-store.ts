import { makeAutoObservable } from 'mobx'
import { Message } from '../types/chat'


class ChatStore {
  socket: WebSocket = null as any
  messages: Message[] = []

  constructor() {
    makeAutoObservable(this)
    this.openChat()
  }

  openChat = () => {
    this.socket = new WebSocket('ws://127.0.0.1:8000/chat/')
    this.socket.addEventListener('message', e => {
      const data = JSON.parse(e.data)
      if (data.type === 'receive_message') {
        console.log(data.message)
        this.messages.push(data.message)
      }
    })
  }

  sendMessage = (text: string) => {
    const event = {
      type: 'send_message',
      text
    }

    this.socket.send(JSON.stringify(event))
  }

  closeChat = () => this.socket.close()
}

export const chatStore = new ChatStore()
