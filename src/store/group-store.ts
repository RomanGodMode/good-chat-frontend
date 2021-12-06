import { RootStore } from './root-store'
import { makeAutoObservable } from 'mobx'
import { Group } from '../types/chat'
import { toast } from 'react-toastify'


export class GroupStore {
  root: RootStore

  constructor(root: RootStore) {
    this.root = root
    makeAutoObservable(this, {}, {autoBind: true})
  }

  get groups() {
    return this.root.chatsListStore.chats.filter(chat => 'members' in chat) as Group[]
  }

  handleAddedToGroup(group: Group, addedUserId: number) {
    if (addedUserId === this.root.userStore.user?.id) {
      this.root.chatsListStore.addChat(group)
      toast.success('Вас добавили в группу')
    }
  }

  addToGroup(userId: number, groupId: number) {
    this.root.websocketStore.sendEvent({
      type: 'add_to_group', user: userId, group: groupId
    })
  }


}
