import { userStore } from '../store/root-store'
import { Message } from '../types/chat'
import { computed } from 'mobx'

export const getMessageStatus = (message: Message) => computed(() => {
  const isOwn = message.sender.id === userStore.user!.id
  const isRead = isOwn
    ? message.users_that_read.some(userId => userStore.user?.id !== userId)
    : message.users_that_read.includes(userStore.user!.id)

  return {isRead, isOwn}
}).get()
