import { api } from './axios-instanse'
import { Dialog } from '../types/chat'

export const DIALOGS = 'dialogs'

export const dialogsApi = {
  getMyDialogs: () => api.get<Dialog[]>('my-dialogs/').then(res => res.data),

  initiateDialog: (answerer: number) => api.post<Dialog>(
    'initiate-dialog/',
    {answerer}
  ).then(res => res.data)
}
