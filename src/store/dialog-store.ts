import { RootStore } from './root-store'
import { chatApi, CHATS } from '../api/chats'
import { Chat } from '../types/chat'
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
      .then(this.addChat)
  }

  addChat<T extends Chat>(chat: T) {
    const oldChats = queryClient.getQueryData<Chat[]>(CHATS) || []
    queryClient.setQueryData(CHATS, [chat, ...oldChats])
    queryClient.invalidateQueries(USERS).then()
    return chat
  }
}
