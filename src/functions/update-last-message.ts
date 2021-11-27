import { Chat, Message } from '../types/chat'

export const updateLastMessage = (chats: Chat[], updatedChat: Chat, message: Message): Chat[] => {
  chats = chats.filter(c => c !== updatedChat)
  updatedChat.last_message = message
  chats.unshift(updatedChat)

  return chats
}