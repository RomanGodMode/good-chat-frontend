import React, { useEffect, useRef, useState } from 'react'
import s from './chat-page.module.scss'
import { observer } from 'mobx-react-lite'
import { Link, NavLink, useParams } from 'react-router-dom'
import { chatStore, userStore } from '../../../../store/root-store'
import { Message } from './message/message'
import arrowLeft from '../../../../images/left-arrow.svg'
import { AnimatePresence, motion } from 'framer-motion'
import { shift } from '../../../../animations/shift'
import { useOnce } from '../../../../hooks/use-once'

export const ChatPage = observer(() => {
  const [newMessage, setNewMessage] = useState('')
  const {dialogId, groupId} = useParams()

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const sendButtonRef = useRef<HTMLButtonElement>(null)


  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY < 300) {
        chatStore.attemptNextPage()
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.altKey && !e.metaKey) {
        textareaRef.current?.focus()
      }
      if (!e.shiftKey && e.key === 'Enter') {
        e.preventDefault()
        sendButtonRef.current?.click()
      }
    }

    document.addEventListener('scroll', onScroll)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('scroll', onScroll)
      document.removeEventListener('keydown', onKeyDown)
      chatStore.unsetChat()
    }
  }, [])

  useOnce(() => {
    dialogId
      ? chatStore.setCurrentChat({dialog: +dialogId})
      : groupId && chatStore.setCurrentChat({group: +groupId})
  }, dialogId || groupId)

  return (
    <div className={`smallContainer ${s.chatPage}`}>
      <div className={`${s.chatCaptionBlind}`}/>
      <header className={`${s.chatCaption} smallContainer`}>
        <Link to="/messager" className={s.toChats}>
          <img src={arrowLeft} alt=""/>
          back
        </Link>
        <div className={s.chatName}>
          {chatStore.currentGroup?.title || (chatStore.currentDialog && userStore.getInterlocutor(chatStore.currentDialog))?.username}
        </div>
        <div className={s.extraOptions}>
          options..
        </div>
      </header>
      <AnimatePresence>
        {
          !chatStore.messages.length
            ? <h3 className={s.emptyMessages}>You haven't written anything yet..</h3>
            : <div className={s.messageGroups}>
              {chatStore.groupedMessages.map(({username, moment, values: messages}) =>
                <motion.div {...shift} className={s.messageGroup} key={`${username} ${moment}`}>
                  <NavLink to="/" className={s.username}>{username}</NavLink>
                  <span className={s.sentAt}>{moment}</span>
                  <div className={s.messages}>
                    {messages.map(m => <Message key={m.id} message={m}/>)}
                  </div>
                </motion.div>)}
            </div>
        }
      </AnimatePresence>
      <form onSubmit={e => e.preventDefault()} className={`${s.sendMessage} smallContainer`}>
        <textarea
          ref={textareaRef} className={s.text} rows={3} placeholder="Write a message..."
          value={newMessage} onChange={e => setNewMessage(e.target.value)}
        />
        <button
          disabled={!newMessage.trim()}
          ref={sendButtonRef} className={s.send}
          onClick={_ => {
            if (newMessage.trim().length) {
              chatStore.sendMessage(newMessage)
              setNewMessage('')
            }
          }}
        >
          Отправить
        </button>
      </form>
    </div>
  )
})
