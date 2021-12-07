import React, { useEffect } from 'react'
import s from './chat-page.module.scss'
import { observer } from 'mobx-react-lite'
import { useLocation, useParams } from 'react-router-dom'
import { chatStore } from '../../../../store/root-store'
import { useOnce } from '../../../../hooks/use-once'
import { ChatHeading } from './chat-heading/chat-heading'
import { ChatMessages } from './chat-messages/chat-messages'
import { ChatForm } from './chat-form/chat-form'


export const ChatPage = observer(() => {
  const {dialogId, groupId} = useParams()
  const {pathname} = useLocation()

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY < 300 && pathname === location.pathname) { // eslint-disable-line no-restricted-globals
        chatStore.attemptNextPage()
      }
    }

    document.addEventListener('scroll', onScroll)

    return () => {
      document.removeEventListener('scroll', onScroll)
      chatStore.unsetChat()
    }
  }, []) // eslint-disable-line

  useOnce(() => {
    dialogId
      ? chatStore.setCurrentChat({dialog: +dialogId})
      : groupId && chatStore.setCurrentChat({group: +groupId})
  }, dialogId || groupId)

  return (
    <div className={`smallContainer ${s.chatPage}`}>
      <ChatHeading/>
      <main className={s.main}>
        <ChatMessages/>
      </main>
      <ChatForm/>
    </div>
  )
})
