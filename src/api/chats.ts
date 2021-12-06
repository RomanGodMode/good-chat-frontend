import { api } from './axios-instanse'
import { ServerChat, ServerDialog, ServerGroup } from '../types/chat'

const withTypingUsers = <T extends ServerChat>(chat: T) => ({...chat, typingUsers: [] as number[]})

class ChatApi {
  // getMyDialogs = () => api.get<Dialog[]>('my-dialogs/').then(res => res.data)

  initiateDialog = (answerer: number) => api.post<ServerDialog>(
    'initiate-dialog/',
    {answerer}
  ).then(res => withTypingUsers(res.data))


  createGroup = (title: string) => api.post<ServerGroup>('create-group/', {title})
    .then(res => withTypingUsers(res.data))

  getAllChats = () => api.get<ServerChat[]>('my-chats/')
    .then(res => res.data.map(withTypingUsers))


  getDialog = (dialogId: number) => api.get<ServerDialog>(`dialog/${dialogId}/`)
    .then(res => withTypingUsers(res.data))

  getCreatedGroups = () => api.get<ServerGroup[]>('created-groups/').then(res => res.data)
}

export const chatApi = new ChatApi()
