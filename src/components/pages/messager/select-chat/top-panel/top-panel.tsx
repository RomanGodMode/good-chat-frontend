import s from './top-panel.module.scss'
import plus from '../../../../../images/plus.svg'
import { useState } from 'react'
import { Modal } from '../../../../shared/modal/modal'
import { chatApi, CHATS } from '../../../../../api/chats'
import { handleServerError } from '../../../../../functions/handle-server-error'
import { toast } from 'react-toastify'
import { useQueryClient } from 'react-query'
import { Chat } from '../../../../../types/chat'

export const TopPanel = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [groupTitle, setGroupTitle] = useState('')
  const queryClient = useQueryClient()

  const createGroup = () => {
    chatApi.createGroup(groupTitle)
      .then(createdGroup => {
        toast.success('success with creating group')
        setIsOpen(false)
        const oldChats = queryClient.getQueryData<Chat[]>(CHATS) || []
        queryClient.setQueryData(CHATS, [createdGroup, ...oldChats])
      })
      .catch(handleServerError(['title']))
  }

  return (
    <header className={s.topPanel}>
      <button onClick={() => setIsOpen(true)} className={`btn ${s.createGroup}`}>
        <img src={plus} alt=""/>
        Create group
      </button>

      <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Group creation">
        <form className={s.createGroup} onSubmit={e => e.preventDefault()}>
          <input value={groupTitle} onChange={e => setGroupTitle(e.target.value)} type="text"/>
          <button onClick={createGroup}>Create</button>
        </form>
      </Modal>

    </header>
  )
}
