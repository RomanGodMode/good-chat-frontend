import { RootStore } from './root-store'
import { makeAutoObservable } from 'mobx'
import { ACCESS_TOKEN } from './user-store'

type WebsocketEvent =
  { type: 'send_message', dialog: number, text: string } |
  { type: 'send_message', group: number, text: string } |

  { type: 'load_messages', dialog: number, page: number } |
  { type: 'load_messages', group: number, page: number } |

  { type: 'add_to_group', user: number, group: number } |

  { type: 'mark_as_read', dialog_id: number } |
  { type: 'mark_as_read', group_id: number } |

  { type: 'start_typing', dialog: number } |
  { type: 'start_typing', group: number } |

  { type: 'stop_typing', dialog: number } |
  { type: 'stop_typing', group: number }

export class WebsocketStore {
  socket: WebSocket = null as any
  private root: RootStore

  constructor(root: RootStore) {
    this.root = root
    makeAutoObservable(this, {}, {autoBind: true})
  }

  openChat() {
    this.socket?.close()
    this.socket = new WebSocket(`ws://127.0.0.1:8000/chat/?token=${localStorage.getItem(ACCESS_TOKEN)}`)
    this.socket.addEventListener('message', e => {
      const data = JSON.parse(e.data)

      const actions: any = {
        'receive_message': () => this.root.chatStore.handleReceiveMessage(data.message),
        'loaded_messages': () => this.root.chatStore.handleLoadedMessages(data.messages, data.page, data.total_pages),
        'read_messages': () => this.root.chatStore.handleReadMessages(data),
        'added_to_group': () => this.root.groupStore.handleAddedToGroup(data.group, data.user_id),
        'someone_start_typing': () => this.root.isTypingStore.handleSomeoneStartTyping(data.user, data),
        'someone_stop_typing': () => this.root.isTypingStore.handleSomeoneStopTyping(data.user, data),
        'error': () => this.handleError(data)
      }

      actions[data.type]?.()
    })
  }

  sendEvent = (event: WebsocketEvent) => this.socket.send(JSON.stringify(event))

  closeChat = () => this.socket.close()

  private handleError(data: any) {
    console.log(data)
  }
}
