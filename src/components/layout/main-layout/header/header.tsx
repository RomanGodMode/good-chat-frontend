import React from 'react'
import s from './header.module.scss'
import { NavLink } from 'react-router-dom'
import { prevent } from '../../../../functions/prevent'
import { userStore } from '../../../../store/user-store'
import { observer } from 'mobx-react-lite'

export const Header = observer(() => {
  const {user, logout} = userStore
  if (user) {
    return <header className={s.header}>
      <NavLink to="/find-friends">Find friends</NavLink>
      <NavLink to="/messager">Messager</NavLink>
      <a href="https://disable-warning/" onClick={prevent(logout)} className={s.logout}>Logout</a>
    </header>
  }

  return <header className={`${s.header} ${s.unauthorizedHeader}`}>
    <NavLink className={s.login} to="/register">Register</NavLink>
    <NavLink className={s.login} to="/login">Login</NavLink>
  </header>
})


