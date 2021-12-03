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

  handleAddedToGroup(group: Group, addedUserId: number) {
    if (addedUserId === this.root.userStore.user?.id) {
      this.root.chatListStore.addChat(group)
      toast.success('Вас добавили в группу')
    }
  }

  addToGroup(userId: number, groupId: number) {
    this.root.chatStore.sendEvent({
      type: 'add_to_group', user: userId, group: groupId
    })
  }


}
