import { Chat, Message } from '../types/chat'
import { action } from 'mobx'

export const updateLastMessage = action('updateLastMessage', (chats: Chat[], updatedChat: Chat, message: Message): Chat[] => {
  chats = chats.filter(c => c !== updatedChat)
  updatedChat.last_message = message
  chats.unshift(updatedChat)

  return chats
})
