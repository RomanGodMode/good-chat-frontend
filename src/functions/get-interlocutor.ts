import { Dialog } from '../types/chat'

export const getInterlocutor = (dialog: Dialog, myId: number | null | undefined) =>
  myId === dialog.initiator.id
    ? dialog.answerer
    : dialog.initiator
