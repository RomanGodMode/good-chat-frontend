import React, { useEffect, useState } from 'react'
import s from './chat-page.module.scss'
import { observer } from 'mobx-react-lite'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { chatApi, CHATS } from '../../../../api/chats'
import { chatStore } from '../../../../store/root-store'
import { Message } from './message/message'
import arrowLeft from '../../../../images/left-arrow.svg'
import { Dialog, Group } from '../../../../types/chat'

export const ChatPage = observer(() => {
  const [newMessage, setNewMessage] = useState('')
  const {dialogId, groupId} = useParams()
  const {data: chats} = useQuery(CHATS, chatApi.getAllChats)


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
    if (chats) {
      if (dialogId) {
        const dialog = chats.find(c => 'initiator' in c && c.id === +dialogId!) as Dialog
        return chatStore.setCurrentChat({dialog})
      }
      const group = chats.find(c => 'creator' in c && c.id === +groupId!) as Group
      chatStore.setCurrentChat({group})
    }
  }, [chats, dialogId, groupId])


  return (
    <div className={`smallContainer ${s.chatPage}`}>
      <div className={`${s.chatCaptionBlind} smallContainer`}/>
      <header className={`${s.chatCaption} smallContainer`}>
        <Link to="/messager" className={s.toChats}>
          <img src={arrowLeft} alt=""/>
          back
        </Link>
        <div className={s.chatName}>{'username'}</div>
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
        <textarea className={s.text} rows={3} placeholder="Write a message..."
                  value={newMessage} onChange={e => setNewMessage(e.target.value)}/>
        <button className={s.send} onClick={_ => chatStore.sendMessage(newMessage)}>
          Отправить
        </button>
      </form>
    </div>
  )
})
