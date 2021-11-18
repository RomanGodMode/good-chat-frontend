import { makeAutoObservable } from 'mobx'
import { UserStore } from './user-store'
import { ChatStore } from './chat-store'


export class RootStore {
  userStore: UserStore
  chatStore: ChatStore

  constructor() {
    this.userStore = new UserStore(this)
    this.chatStore = new ChatStore(this)
    makeAutoObservable(this)
  }
}

export const rootStore = new RootStore()

export const chatStore = rootStore.chatStore
export const userStore = rootStore.userStore
