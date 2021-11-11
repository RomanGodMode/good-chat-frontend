import './App.css'
import 'react-toastify/dist/ReactToastify.css'
import { Routes } from 'react-router-dom'
import { useAppRoutes } from './app-routes'
import { ToastContainer } from 'react-toastify'
import { userStore } from './store/user-store'
import { observer } from 'mobx-react-lite'


export const App = observer(() => {
  const routes = useAppRoutes(!!userStore.user)

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
