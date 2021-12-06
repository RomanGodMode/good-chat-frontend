import { User } from './user'
import { Omit } from 'framer-motion/types/types'

// type WithoutLastMessage<T> = Omit<T, 'last_message'>
//
// export type DialogWithoutLastMessage = WithoutLastMessage<Dialog>
// export type GroupWithoutLastMessage = WithoutLastMessage<Group>

export type Dialog = {
  id: number
  initiator: User
  answerer: User
  created_at: string
  last_message: Message | null
  typingUsers: number[]
}

export type Group = {
  id: number
  title: string
  creator: User
  members: User[]
  created_at: string
  last_message: Message | null
  typingUsers: number[]
}

export type ServerDialog = Omit<Dialog, 'typingUsers'>
export type ServerGroup = Omit<Group, 'typingUsers'>
export type ServerChat = ServerDialog | ServerGroup

export type Chat = Dialog | Group

export type Message = {
  id: number
  text: string
  sent_at: string
  sender: User
  users_that_read: number[]
}

export type NewDialogMessage = Message & { dialog: number }
export type NewGroupMessage = Message & { group: number }

export type NewMessage = NewDialogMessage | NewGroupMessage

export type OptionalChat = { dialog?: number | null, group?: number | null }


