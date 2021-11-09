import React from 'react'
import { Outlet } from "react-router-dom"
import { Header } from "./header/header"

export const MainLayout = () => {
  return (
    <div className="layout container">
      <Header/>
      <Outlet/>
    </div>
  )
}

