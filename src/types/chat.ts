import { User } from './user'

type WithoutLastMessage<T> = Omit<T, 'last_message'>

export type DialogWithoutLastMessage = WithoutLastMessage<Dialog>
export type GroupWithoutLastMessage = WithoutLastMessage<Group>

export type Dialog = {
  id: number
  initiator: User
  answerer: User
  created_at: string
  last_message: Message | null
}

export type Group = {
  id: number
  title: string
  creator: User
  members: User[]
  created_at: string
  last_message: Message | null
}

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




