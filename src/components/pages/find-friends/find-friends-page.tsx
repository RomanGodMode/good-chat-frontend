import { useQuery } from 'react-query'
import { usersApi } from '../../../api/users'
import s from './find-friends.module.scss'
import { Loader } from '../../shared/loader/loader'
import { useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { User } from '../../../types/user'
import { dialogStore, groupStore } from '../../../store/root-store'
import plus from '../../../images/plus.svg'
import { Modal } from '../../shared/modal/modal'
import { useState } from 'react'
import { chatApi } from '../../../api/chats'
import { AnimatePresence, motion } from 'framer-motion'
import { shift } from '../../../animations/shift'

export const FindFriendsPage = observer(() => {
  const {data: users, isLoading} = useQuery('users', usersApi.getUsers)
  const {data: groups} = useQuery('created-groups', chatApi.getCreatedGroups)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<null | number>(null)

  const navigate = useNavigate()

  if (isLoading)
    return <Loader/>

  const writeTo = async (user: User) => {
    dialogStore.initiateDialog(user.id)
      .then(createdDialog => navigate(`/messager/dialog/${createdDialog.id}`))
  }


  return (
    <main>
      <motion.h2 {...shift} style={{marginBottom: 20}}>Find friends
      </motion.h2>
      <section className={s.userList}>
        <AnimatePresence>
          {users?.map(u => <motion.div {...shift} key={u.id} className={s.userItem}>
            <motion.h4>{u.username}</motion.h4>
            <button className={s.writeTo} onClick={() => writeTo(u)}>Write to..</button>
            <button className={s.addToGroup} onClick={() => {
              setIsModalOpen(true)
              setSelectedUserId(u.id)
            }}>
              <img className={s.plus} src={plus} alt=""/>
              Add to group
            </button>
          </motion.div>)}
        </AnimatePresence>
        <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen} title="Add to group">
          <div className={s.groupList}>
            {groups?.map(g => <button className={`${s.groupItem} btn`} key={g.id} onClick={() => {
              groupStore.addToGroup(selectedUserId!, g.id)
              setIsModalOpen(false)
            }}>{g.title}</button>)}
          </div>
        </Modal>
      </section>
    </main>
  )
})

