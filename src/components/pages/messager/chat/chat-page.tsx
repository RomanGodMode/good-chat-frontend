import React, { useEffect, useRef, useState } from 'react'
import s from './chat-page.module.scss'
import { observer } from 'mobx-react-lite'
import { Link, NavLink, useLocation, useParams } from 'react-router-dom'
import { chatStore, isTypingStore, userStore } from '../../../../store/root-store'
import { Message } from './message/message'
import arrowLeft from '../../../../images/left-arrow.svg'
import { AnimatePresence, motion } from 'framer-motion'
import { shift } from '../../../../animations/shift'
import { useOnce } from '../../../../hooks/use-once'
import { debounce } from '../../../../functions/debounce'
import { joinByComma } from '../../../../functions/join-by-comma'

const STOP_TYPING_TIME = 2000

const debouncedStopTyping = debounce(isTypingStore.sendStopTyping, STOP_TYPING_TIME)

export const ChatPage = observer(() => {
  const [newMessage, setNewMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const sendButtonRef = useRef<HTMLButtonElement>(null)

  const {dialogId, groupId} = useParams()
  const {pathname} = useLocation()


  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY < 300 && pathname === location.pathname) { // eslint-disable-line no-restricted-globals
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
  }, []) // eslint-disable-line

  useOnce(() => {
    dialogId
      ? chatStore.setCurrentChat({dialog: +dialogId})
      : groupId && chatStore.setCurrentChat({group: +groupId})
  }, dialogId || groupId)

  // gigaLog(isTypingStore.currentChatTypingList)

  console.log(isTypingStore.isTyping)
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
      <main className={s.main}>
        <AnimatePresence>
          {
            !chatStore.messages.length
              ? <h3 className={s.emptyMessages}>You haven't written anything yet..</h3>
              : <div className={s.messageGroups}>
                {
                  chatStore.groupedMessages.map(({username, moment, values: messages}) =>
                    <motion.div {...shift} className={s.messageGroup} key={`${username} ${moment}`}>
                      <NavLink to="/" className={s.username}>{username}</NavLink>
                      <span className={s.sentAt}>{moment}</span>
                      <div className={s.messages}>
                        {messages.map(m => <Message key={m.id} message={m}/>)}
                      </div>
                    </motion.div>)
                }
              </div>
          }
        </AnimatePresence>

      </main>
      <footer className={`${s.bottomMenu} smallContainer`}>
        <form onSubmit={e => e.preventDefault()} className={s.sendMessage}>
          <textarea
            ref={textareaRef} className={s.text} rows={3} placeholder="Write a message..."
            value={newMessage}
            onChange={e => {
              const dialog = chatStore.currentDialog?.id || null
              const group = chatStore.currentGroup?.id || null
              if (!isTypingStore.isTyping) {
                isTypingStore.sendStartTyping({dialog, group})
              }
              debouncedStopTyping({dialog, group})
              setNewMessage(e.target.value)
            }}
          />
          <button
            disabled={!newMessage.trim()}
            ref={sendButtonRef} className={s.send}
            onClick={_ => {
              if (newMessage.trim().length || true) {
                chatStore.sendMessage(newMessage)
                setNewMessage('')
              }
            }}
          >
            Отправить
          </button>
        </form>
        <aside className={s.typingUsers}>
          {
            joinByComma(
              isTypingStore.currentChatTypingList.map(user =>
                <span key={user.id} className={s.typingUser}>{user.username}</span>
              )
            )
          }
          {!!isTypingStore.currentChatTypingList.length && <span>&nbsp;is typing...</span>}
        </aside>
      </footer>
      <div className={`${s.chatFooterBlind}`}/>
    </div>
  )
})
