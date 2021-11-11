import { makeAutoObservable } from 'mobx'
import { AuthenticatedUser } from '../types/user'
import { AuthForm } from '../components/pages/auth/auth-page'
import { authApi } from '../api/auth'
import jwtDecode from 'jwt-decode'

export const ACCESS_TOKEN = 'access_token'
export const REFRESH_TOKEN = 'refresh_token'

const isDeprecated = (exp: number) => exp * 1000 < Date.now()

class UserStore {
  user: AuthenticatedUser | null = null

  constructor() {
    makeAutoObservable(this)

    const token = localStorage.getItem(ACCESS_TOKEN)
    if (!token) {
      return
    }
    const tokenDeprecated = this.loginByToken(token)
    tokenDeprecated && this.refresh()
  }

  loginByToken = (token: string) => {
    const {name, id, exp} = jwtDecode<AuthenticatedUser & { exp: number }>(token)
    if (isDeprecated(exp)) {
      return true
    }
    this.user = {name, id}
    setTimeout(this.refresh, 1000 * 60 * 60)
  }

  refresh = () => {
    return authApi.refresh(localStorage.getItem(REFRESH_TOKEN) || '')
      .then(data => {
        localStorage.setItem(ACCESS_TOKEN, data.access)
        this.loginByToken(data.access)
      }).catch()
  }

  login = async (data: AuthForm) => {
    const {access, refresh} = await authApi.login(data)
    localStorage.setItem(ACCESS_TOKEN, access)
    localStorage.setItem(REFRESH_TOKEN, refresh)
    this.loginByToken(access)
  }

  logout = () => {
    console.log(this)
    localStorage.removeItem(ACCESS_TOKEN)
    localStorage.removeItem(REFRESH_TOKEN)
    this.user = null
  }
}

export const userStore = new UserStore()

