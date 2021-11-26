import './App.css'
import 'react-toastify/dist/ReactToastify.css'
import { Routes } from 'react-router-dom'
import { useAppRoutes } from './app-routes'
import { ToastContainer } from 'react-toastify'
import { observer } from 'mobx-react-lite'
import { userStore } from './store/root-store'
import { useEffect } from 'react'


export const App = observer(() => {
  const routes = useAppRoutes(!!userStore.user, userStore.isLoading)

  useEffect(() => userStore.checkAuth(), [])

  return (
    <div className="app">
      <Routes>
        {routes}
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        theme="light"
      />
    </div>
  )
})
