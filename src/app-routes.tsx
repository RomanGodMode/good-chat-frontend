import { MainLayout } from './components/layout/main-layout/main-layout'
import { Navigate, Route } from 'react-router-dom'
import { SelectChatPage } from './components/pages/messager/select-chat/select-chat-page'
import { ChatPage } from './components/pages/messager/chat/chat-page'
import { FindFriendsPage } from './components/pages/find-friends/find-friends-page'
import { LoginPage } from './components/pages/auth/login-page'
import { RegisterPage } from './components/pages/auth/register-page'

export const useAppRoutes = (isAuthenticated: boolean, isAuthenticatedLoading: boolean) => {

  if (isAuthenticated) {
    return (
      <Route path="/" element={<MainLayout/>}>
        <Route index element={<Navigate to={'messager'}/>}/>
        <Route path="messager">
          <Route index element={<SelectChatPage/>}/>
          <Route path="dialog/:dialogId" element={<ChatPage/>}/>
          <Route path="group/:groupId" element={<ChatPage/>}/>
        </Route>
        <Route path="find-friends" element={<FindFriendsPage/>}/>
        <Route path="*" element={<Navigate to="messager"/>}/>
      </Route>
    )
  }

  return <>
    <Route path="/" element={<MainLayout/>}>
      <Route path="register" element={<RegisterPage/>}/>
      <Route path="login" element={<LoginPage/>}/>
      {!isAuthenticatedLoading && <Route path="*" element={<Navigate to="login"/>}/>}
    </Route>
  </>
}

