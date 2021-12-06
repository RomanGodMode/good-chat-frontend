import { makeAutoObservable } from 'mobx'
import { UserStore } from './user-store'
import { ChatStore } from './chat-store'
import { DialogStore } from './dialog-store'
import { GroupStore } from './group-store'
import { ChatsListStore } from './chats-list-store'
import { WebsocketStore } from './websocket-store'
import { IsTypingStore } from './is-typing-store'


export class RootStore {
  userStore: UserStore
  websocketStore: WebsocketStore
  chatStore: ChatStore
  dialogStore: DialogStore
  groupStore: GroupStore
  chatsListStore: ChatsListStore
  isTypingStore: IsTypingStore

  constructor() {
    this.userStore = new UserStore(this)
    this.websocketStore = new WebsocketStore(this)
    this.chatsListStore = new ChatsListStore(this)
    this.chatStore = new ChatStore(this)
    this.dialogStore = new DialogStore(this)
    this.groupStore = new GroupStore(this)
    this.isTypingStore = new IsTypingStore(this)
    makeAutoObservable(this)
  }
}

export const rootStore = new RootStore()

export const userStore = rootStore.userStore
export const chatsListStore = rootStore.chatsListStore
export const chatStore = rootStore.chatStore
export const dialogStore = rootStore.dialogStore
export const groupStore = rootStore.groupStore
export const isTypingStore = rootStore.isTypingStore
