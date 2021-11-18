import React, { useEffect, useState } from 'react'
import s from './chat-page.module.scss'
import { observer } from 'mobx-react-lite'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { dialogsApi } from '../../../../api/dialogs'
import { getInterlocutor } from '../../../../functions/get-interlocutor'
import { chatStore, userStore } from '../../../../store/root-store'
import { Message } from './message/message'
import arrowLeft from '../../../../images/left-arrow.svg'

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
    const onScroll = () => {
      if (window.scrollY < 50) {
        chatStore.attemptNextPage()
      }
    }

    document.addEventListener('scroll', onScroll)
    return () => document.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (dialogs) {
      chatStore.setCurrentDialog(dialogs.find(d => getInterlocutor(d, userStore.user?.id).username === username))
    }
  }, [dialogs, username])


  return (
    <div className={`smallContainer ${s.chatPage}`}>
      <div className={`${s.chatCaptionBlind} smallContainer`}/>
      <header className={`${s.chatCaption} smallContainer`}>
        <Link to="/messager" className={s.toChats}>
          <img src={arrowLeft} alt=""/>
          back
        </Link>
        <div className={s.chatName}>{username}</div>
        <div className={s.extraOptions}>
          options..
        </div>
      </header>
      {
        !chatStore.messages.length
          ? <h3 className={s.emptyMessages}>You haven't written anything yet..</h3>
          : <div className={s.messages}>
            {chatStore.messages.map(m => <Message key={m.id} message={m}/>)}
          </div>
      }
      <form onSubmit={e => e.preventDefault()} className={`${s.sendMessage} smallContainer`}>
        <textarea className={s.text} rows={3} placeholder="Напишите сообщение..."
                  value={newMessage} onChange={e => setNewMessage(e.target.value)}/>
        <button className={s.send} onClick={_ => chatStore.sendMessage(newMessage)}>
          Отправить
        </button>
      </form>
    </div>
  )
})
