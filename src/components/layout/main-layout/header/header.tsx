import React from 'react'
import s from './header.module.scss'
import { NavLink } from "react-router-dom"
import { useUser } from "../../../../hooks/use-user";

export const Header = () => {
  const user = useUser()
  if (user) {
    return <header className={s.header}>
      <NavLink to="/find-friends">Find friends</NavLink>
      <NavLink to="/messager">Messager</NavLink>
      <NavLink to="/logout" className={s.logout}>Logout</NavLink>
    </header>
  }

  return <header className={`${s.header} ${s.unauthorizedHeader}`}>
    <NavLink className={s.login} to="/register">Register</NavLink>
    <NavLink className={s.login} to="/login">Login</NavLink>
  </header>
}


