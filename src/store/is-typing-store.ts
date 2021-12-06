import { makeAutoObservable } from 'mobx'
import { OptionalChat } from '../types/chat'
import { remove } from '../functions/actions/remove'
import { RootStore } from './root-store'


export class IsTypingStore {
  isTyping = false
  private root: RootStore

  constructor(root: RootStore) {
    this.root = root
    makeAutoObservable(this, {}, {autoBind: true})
  }

  get currentChatTypingList() {
    if (this.root.chatStore.currentDialog) {
      const members = [this.root.chatStore.currentDialog.initiator, this.root.chatStore.currentDialog.answerer]
      return this.root.chatStore.currentDialog.typingUsers
        .filter(userId => userId !== this.root.userStore.user?.id)
        .map(userId => members.find(user => user.id === userId)!)
    } else if (this.root.chatStore.currentGroup) {
      const members = this.root.chatStore.currentGroup.members
      return this.root.chatStore.currentGroup.typingUsers
        .filter(userId => userId !== this.root.userStore.user?.id)
        .map(userId => members.find(user => user.id === userId)!)
    }
    return []
  }

  sendStartTyping({dialog, group}: OptionalChat) {
    if (!dialog && !group) {
      return
    }
    this.isTyping = true
    if (dialog) {
      this.root.websocketStore.sendEvent({type: 'start_typing', dialog})
    } else if (group) {
      this.root.websocketStore.sendEvent({type: 'start_typing', group})
    }
  }

  handleSomeoneStartTyping(user: number, {dialog, group}: OptionalChat) {
    if (!dialog && !group) {
      return
    }

    if (dialog) {
      this.root.dialogStore.dialogs.find(d => d.id === dialog)?.typingUsers?.push(user)
    } else if (group) {
      this.root.groupStore.groups.find(g => g.id === group)?.typingUsers.push(user)
    }
  }

  sendStopTyping({dialog, group}: OptionalChat) {
    if (!dialog && !group) {
      return
    }
    this.isTyping = false
    if (dialog) {
      this.root.websocketStore.sendEvent({type: 'stop_typing', dialog})
    } else if (group) {
      this.root.websocketStore.sendEvent({type: 'stop_typing', group})
    }
  }

  handleSomeoneStopTyping(user: number, {dialog, group}: OptionalChat) {
    if (!dialog && !group) {
      return
    }
    if (dialog) {
      const typingUsers = this.root.dialogStore.dialogs.find(d => d.id === dialog)?.typingUsers
      typingUsers && remove(typingUsers, user)
    } else if (group) {
      const typingUsers = this.root.groupStore.groups.find(g => g.id === group)?.typingUsers
      typingUsers && remove(typingUsers, user)
    }
  }
}
