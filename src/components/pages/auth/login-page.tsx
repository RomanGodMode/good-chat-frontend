import { AuthPage } from './auth-page'
import { userStore } from '../../../store/user-store'
import { observer } from 'mobx-react-lite'
import { handleServerError } from '../../../functions/handle-server-error'


export const LoginPage = observer(() => {

  return <AuthPage
    onSubmit={data => userStore.login(data).catch(handleServerError(['username', 'password']))}
    isRegister={false}
  />
})
