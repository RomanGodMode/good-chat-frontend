import { api } from './axios-instanse'
import { User } from '../types/user'


export const usersApi = {
  getUsers: () => api.get<User[]>('users/').then(res => res.data)
}
