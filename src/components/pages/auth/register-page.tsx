import { AuthForm, AuthPage } from './auth-page'
import { authApi } from '../../../api/auth'
import { handleServerError } from '../../../functions/handle-server-error'

const onSubmit = (data: AuthForm) => authApi.register(data)
  .catch(handleServerError(['username', 'password']))

export const RegisterPage = () => <AuthPage onSubmit={onSubmit} isRegister={true}/>
