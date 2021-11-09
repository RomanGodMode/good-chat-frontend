import './App.css'
import { Routes } from 'react-router-dom'
import { useAppRoutes } from "./app-routes"

export const App = () => {
  const routes = useAppRoutes()

  return (
    <div className="app">
      <Routes>
        {routes}
      </Routes>
    </div>
  )
}
