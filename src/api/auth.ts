import { api } from './axios-instanse'
import { AuthForm } from '../components/pages/auth/auth-page'

type Tokens = {
  access: string
  refresh: string
}

type RefreshedToken = {
  access: string
}

type RegisterPayload = {
  id: number
  username: string
}

export const authApi = {
  login: (data: AuthForm) => api.post<Tokens>('login/', data)
    .then(res => res.data),

  refresh: (refreshToken: string) => api.post<RefreshedToken>('refresh/', {refresh: refreshToken})
    .then(res => res.data),

  register: (data: AuthForm) => api.post<RegisterPayload>('register/', data)
    .then(res => res.data)
}
