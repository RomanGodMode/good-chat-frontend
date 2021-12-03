import { makeAutoObservable } from 'mobx'
import { UserStore } from './user-store'
import { ChatStore } from './chat-store'
import { DialogStore } from './dialog-store'
import { GroupStore } from './group-store'
import { ChatListStore } from './chat-list-store'


export class RootStore {
  userStore: UserStore
  chatStore: ChatStore
  dialogStore: DialogStore
  groupStore: GroupStore
  chatListStore: ChatListStore

  constructor() {
    this.userStore = new UserStore(this)
    this.chatListStore = new ChatListStore(this)
    this.chatStore = new ChatStore(this)
    this.dialogStore = new DialogStore(this)
    this.groupStore = new GroupStore(this)
    makeAutoObservable(this)
  }
}

export const rootStore = new RootStore()

export const userStore = rootStore.userStore
export const chatListStore = rootStore.chatListStore
export const chatStore = rootStore.chatStore
export const dialogStore = rootStore.dialogStore
export const groupStore = rootStore.groupStore
