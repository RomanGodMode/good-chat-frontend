import { makeAutoObservable } from 'mobx'
import { AuthenticatedUser } from '../types/user'
import { AuthForm } from '../components/pages/auth/auth-page'
import { authApi } from '../api/auth'
import jwtDecode from 'jwt-decode'
import { RootStore } from './root-store'
import { Dialog } from '../types/chat'
import { getInterlocutor } from '../functions/get-interlocutor'

type DecodedToken = {
  user_id: number
  name: string
  exp: number
}

export const ACCESS_TOKEN = 'access_token'
export const REFRESH_TOKEN = 'refresh_token'

const isDeprecated = (exp: number) => exp * 1000 < Date.now()

export class UserStore {
  root: RootStore

  user: AuthenticatedUser | null = null
  isLoading = true

  constructor(root: RootStore) {
    this.root = root
    makeAutoObservable(this, {}, {autoBind: true})
  }

  checkAuth = () => {
    this.isLoading = true
    const token = localStorage.getItem(ACCESS_TOKEN)
    if (!token) {
      this.isLoading = false
      return
    }
    const tokenDeprecated = this.loginByToken(token)
    tokenDeprecated && this.refresh()
  }

  loginByToken = (token: string) => {
    const {name, user_id, exp} = jwtDecode<DecodedToken>(token)
    if (isDeprecated(exp)) {
      return true
    }
    this.user = {id: user_id, name}
    this.isLoading = false
    this.root.chatStore.openChat()

    setTimeout(this.refresh, 1000 * 60 * 4)
  }

  refresh = () => {
    return authApi.refresh(localStorage.getItem(REFRESH_TOKEN) || '')
      .then(data => {
        localStorage.setItem(ACCESS_TOKEN, data.access)
        this.loginByToken(data.access)
      }).catch(() => this.isLoading = false)
  }

  login = async (data: AuthForm) => {
    const {access, refresh} = await authApi.login(data)
    localStorage.setItem(ACCESS_TOKEN, access)
    localStorage.setItem(REFRESH_TOKEN, refresh)
    this.loginByToken(access)
  }

  logout = () => {
    localStorage.removeItem(ACCESS_TOKEN)
    localStorage.removeItem(REFRESH_TOKEN)
    this.user = null
    this.isLoading = false
  }

  getInterlocutor(dialog: Dialog) {
    return getInterlocutor(dialog, this.user?.id)
  }
}

