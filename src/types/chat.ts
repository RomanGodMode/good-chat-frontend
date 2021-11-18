import { User } from './user'

export type DialogWithoutLastMessage = {
  id: number
  initiator: User
  answerer: User
  created_at: string
}

export type Dialog = DialogWithoutLastMessage & {
  last_message: Message | null
}

export type Message = {
  id: number
  text: string
  sent_at: string
  sender: User
  dialog: number
}
