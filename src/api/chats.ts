import { api } from './axios-instanse'
import { Chat, Dialog, Group } from '../types/chat'

export const CHATS = 'chats'

class ChatApi {
  // getMyDialogs = () => api.get<Dialog[]>('my-dialogs/').then(res => res.data)

  initiateDialog = (answerer: number) => api.post<Dialog>(
    'initiate-dialog/',
    {answerer}
  ).then(res => res.data)


  createGroup = (title: string) => api.post<Group>('create-group/', {title}).then(res => res.data)

  getAllChats = () => api.get<Chat[]>('my-chats/').then(res => {
    // console.dir(res)
    return res.data
  })

  getDialog = (dialogId: number) => api.get<Dialog>(`dialog/${dialogId}/`).then(res => res.data)

  getCreatedGroups = () => api.get<Group[]>('created-groups/').then(res => res.data)
}

export const chatApi = new ChatApi()
