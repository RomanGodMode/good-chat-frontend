import { RootStore } from './root-store'
import { chatApi } from '../api/chats'
import { makeAutoObservable } from 'mobx'

export class DialogStore {
  private root: RootStore

  constructor(root: RootStore) {
    this.root = root
    makeAutoObservable(this, {}, {autoBind: true})
  }

  initiateDialog(userId: number) {
    return chatApi.initiateDialog(userId)
      .then(this.root.chatListStore.addChat)
  }

}
