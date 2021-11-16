import { useMutation, useQuery, useQueryClient } from 'react-query'
import { USERS, usersApi } from '../../../api/users'
import s from './find-friends.module.scss'
import { Loader } from '../../shared/loader/loader'
import { useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { User } from '../../../types/user'
import { DIALOGS, dialogsApi } from '../../../api/dialogs'
import { DialogWithoutLastMessage } from '../../../types/chat'

export const FindFriendsPage = observer(() => {
  const {data: users, isLoading} = useQuery('users', usersApi.getUsers)
  const initiateDialog = useMutation(dialogsApi.initiateDialog)
  const queryClient = useQueryClient()

  const navigate = useNavigate()

  if (isLoading)
    return <Loader/>

  const writeTo = async (user: User) => {
    initiateDialog.mutate(user.id, {
      onSuccess: createdDialog => {
        const oldDialogs = queryClient.getQueryData<DialogWithoutLastMessage[]>(DIALOGS) || []
        queryClient.setQueryData(DIALOGS, [createdDialog, ...oldDialogs])

        navigate(`/messager/${user.username}`)

        queryClient.invalidateQueries(USERS)
      }
    })
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

