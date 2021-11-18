import React from 'react'
import s from './header.module.scss'
import { NavLink } from 'react-router-dom'
import { prevent } from '../../../../functions/prevent'
import { observer } from 'mobx-react-lite'
import { userStore } from '../../../../store/root-store'

export const Header = observer(() => {
  const {user, logout} = userStore
  if (user) {
    return <header className={`${s.header} container`}>
      <NavLink to="/find-friends">Find friends</NavLink>
      <NavLink to="/messager">Messager</NavLink>
      <h3 className={s.username}>{user.name}</h3>
      <a href="https://disable-warning/" onClick={prevent(logout)} className={s.logout}>Logout</a>
    </header>
  }

  return <header className={`${s.header} ${s.unauthorizedHeader}`}>
    <NavLink className={s.login} to="/register">Register</NavLink>
    <NavLink className={s.login} to="/login">Login</NavLink>
  </header>
})


