import s from './chat-form.module.scss'
import { chatStore, isTypingStore } from '../../../../../store/root-store'
import { joinByComma } from '../../../../../functions/join-by-comma'
import React, { useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { debounce } from '../../../../../functions/debounce'

const STOP_TYPING_TIME = 2000
const debouncedStopTyping = debounce(isTypingStore.sendStopTyping, STOP_TYPING_TIME)

export const ChatForm = observer(() => {
  const [newMessage, setNewMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const sendButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.altKey && !e.metaKey) {
        textareaRef.current?.focus()
      }
      if (!e.shiftKey && e.key === 'Enter') {
        e.preventDefault()
        sendButtonRef.current?.click()
      }
    }

    document.addEventListener('keydown', onKeyDown)

    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <>
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
    </>
  )
})
