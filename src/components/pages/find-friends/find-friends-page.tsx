import { useQuery } from 'react-query'
import { usersApi } from '../../../api/users'
import s from './find-friends.module.scss'
import { Loader } from '../../shared/loader/loader'
import { useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { User } from '../../../types/user'
import { useEffect } from 'react'
import { chatStore } from '../../../store/root-store'

export const FindFriendsPage = observer(() => {
  const {data: users, isLoading} = useQuery('users', usersApi.getUsers)
  const navigate = useNavigate()

  useEffect(() => {
    chatStore.setOnInitiateDialogSuccess(dialog => navigate(`/messager/dialog/${dialog.id}`))
  }, []) // eslint-disable-line

  if (isLoading)
    return <Loader/>

  const writeTo = async (user: User) => {
    chatStore.initiateDialog(user.id)
  }

  return (
    <section className={s.userList}>
      {users?.map(u => <div key={u.id} className={s.userItem}>
        <h4>{u.username}</h4>
        <button className={s.writeTo} onClick={() => writeTo(u)}>Write to..</button>
      </div>)}
    </section>
  )
})

