import { AuthPage } from './auth-page'
import { observer } from 'mobx-react-lite'
import { handleServerError } from '../../../functions/handle-server-error'
import { userStore } from '../../../store/root-store'


export const LoginPage = observer(() => {

  return <AuthPage
    onSubmit={data => userStore.login(data).catch(handleServerError(['username', 'password']))}
    isRegister={false}
  />
})
