import { RootStore } from './root-store'
import { chatApi, CHATS } from '../api/chats'
import { Dialog } from '../types/chat'
import { queryClient } from '../index'
import { USERS } from '../api/users'
import { makeAutoObservable } from 'mobx'

export class DialogStore {
  private root: RootStore

  constructor(root: RootStore) {
    this.root = root
    makeAutoObservable(this, {}, {autoBind: true})
  }

  initiateDialog(userId: number) {
    return chatApi.initiateDialog(userId)
      .then(this.addDialog)
  }

  addDialog(dialog: Dialog) {
    const oldDialogs = queryClient.getQueryData<Dialog[]>(CHATS) || []
    queryClient.setQueryData(CHATS, [dialog, ...oldDialogs])
    queryClient.invalidateQueries(USERS).then()
    return dialog
  }
}
