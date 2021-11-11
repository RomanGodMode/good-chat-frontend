import { useQuery } from 'react-query'
import { NavLink } from 'react-router-dom'
import { usersApi } from '../../../api/users'
import s from './find-friends.module.scss'

export const FindFriendsPage = () => {
  const {isLoading, data: users} = useQuery('users', usersApi.getUsers)
  if (isLoading)
    return <div>ЗЕБРЮГЕ</div>

  return (
    <section className={s.userList}>
      {users?.map(u => <div key={u.id} className={s.userItem}>
        <h4>{u.username}</h4>
        <NavLink to="giga-chat">Write to..</NavLink>
      </div>)}
    </section>
  )
}

