import { makeAutoObservable } from 'mobx'
import { UserStore } from './user-store'
import { ChatStore } from './chat-store'
import { DialogStore } from './dialog-store'
import { GroupStore } from './group-store'


export class RootStore {
  userStore: UserStore
  chatStore: ChatStore
  dialogStore: DialogStore
  groupStore: GroupStore

  constructor() {
    this.userStore = new UserStore(this)
    this.chatStore = new ChatStore(this)
    this.dialogStore = new DialogStore(this)
    this.groupStore = new GroupStore(this)
    makeAutoObservable(this)
  }
}

export const rootStore = new RootStore()

export const chatStore = rootStore.chatStore
export const userStore = rootStore.userStore
export const dialogStore = rootStore.dialogStore
export const groupStore = rootStore.groupStore
