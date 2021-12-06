import { RootStore } from './root-store'
import { chatApi } from '../api/chats'
import { makeAutoObservable } from 'mobx'
import { Dialog } from '../types/chat'

export class DialogStore {
  private root: RootStore

  constructor(root: RootStore) {
    this.root = root
    makeAutoObservable(this, {}, {autoBind: true})
  }

  get dialogs() {
    return this.root.chatsListStore.chats.filter(chat => 'initiator' in chat) as Dialog[]
  }

  initiateDialog(userId: number) {
    return chatApi.initiateDialog(userId)
      .then(this.root.chatsListStore.addChat)
  }

}
