import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { chatStore } from '../../../../store/chat-store'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { dialogsApi } from '../../../../api/dialogs'
import { getInterlocutor } from '../../../../functions/get-interlocutor'
import { userStore } from '../../../../store/user-store'

export const ChatPage = observer(() => {
  const [newMessage, setNewMessage] = useState('')
  const {username} = useParams()
  const {data: dialogs} = useQuery('dialogs', dialogsApi.getMyDialogs)

  // const interlocutor = useMemo(
  //   () => chatStore.currentDialog && getInterlocutor(chatStore.currentDialog, userStore.user?.id)
  //   , [chatStore.currentDialog, userStore.user?.id]
  // )
  // gigaLog(interlocutor)

  useEffect(() => {
    chatStore.openChat()
  }, [])

  useEffect(() => {
    if (dialogs) {
      chatStore.setCurrentDialog(dialogs.find(d => getInterlocutor(d, userStore.user?.id).username === username))
      // chatStore.loadMessages()
    }
  }, [dialogs, username])

  console.log(JSON.parse(JSON.stringify(chatStore.messages)))

  return (
    <div>
      {username}
      <div>
        {chatStore.messages.map(m => <div key={m.id}>{m.id} {m.text}</div>)}
      </div>
      <form onSubmit={e => e.preventDefault()} className="sendMessage">
        <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)}/>
        <button onClick={_ => chatStore.sendMessage(newMessage)}>Отправить</button>
      </form>
    </div>
  )
})
