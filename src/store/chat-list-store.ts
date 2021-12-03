import { RootStore } from './root-store'
import { action, makeAutoObservable, onBecomeObserved } from 'mobx'
import { Chat } from '../types/chat'
import { chatApi } from '../api/chats'
import { queryClient } from '../index'
import { USERS } from '../api/users'

export class ChatListStore {
  chats: Chat[] = []
  isLoading = false
  isLoaded = false
  error: string | null = null
  private root: RootStore

  constructor(root: RootStore) {
    this.root = root
    makeAutoObservable(this, {}, {autoBind: true})
    onBecomeObserved(this, 'chats', this.fetchChats)
  }

  fetchChats() {
    this.isLoading = true
    return chatApi.getAllChats()
      .then(action('setChats', chats => this.chats = chats))
      .finally(action('fetchChatsEnd', () => {
        this.isLoading = false
        this.isLoaded = true
      }))
  }

  addChat<T extends Chat>(chat: T) {
    this.chats.unshift(chat)
    queryClient.invalidateQueries(USERS).then()
    return chat
  }

}


