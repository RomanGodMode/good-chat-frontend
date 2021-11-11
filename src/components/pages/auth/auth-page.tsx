import s from './auth-page.module.scss'
import { useForm } from 'react-hook-form'

export type AuthForm = {
  password: string
  username: string
}

type Props = {
  isRegister: boolean
  onSubmit: (data: AuthForm) => Promise<any>
}

export const AuthPage = ({isRegister, onSubmit}: Props) => {
  const {register, handleSubmit} = useForm<AuthForm>()

  return (
    <main className={s.authPage}>
      <h1>{isRegister ? 'REGISTER' : 'LOGIN'}</h1>

      <form className={s.authForm} onSubmit={handleSubmit(onSubmit)}>
        <div className="inputGroup">
          <label htmlFor="username">Username</label>
          <input {...register('username', {required: true})} id="username" type="text"/>
        </div>
        <div className="inputGroup">
          <label htmlFor="password">Password</label>
          <input {...register('password', {required: true})} id="password" type="text"/>
        </div>
        <button>{isRegister ? 'Register' : 'Login'}</button>
      </form>
    </main>
  )
}
