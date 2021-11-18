import { AuthForm, AuthPage } from './auth-page'
import { authApi } from '../../../api/auth'
import { handleServerError } from '../../../functions/handle-server-error'
import { toast } from 'react-toastify'

const onSubmit = (data: AuthForm) => authApi.register(data)
  .then(() => toast.success('Congratulations with successful registration. Now you can login'))
  .catch(handleServerError(['username', 'password']))

export const RegisterPage = () => <AuthPage onSubmit={onSubmit} isRegister={true}/>
