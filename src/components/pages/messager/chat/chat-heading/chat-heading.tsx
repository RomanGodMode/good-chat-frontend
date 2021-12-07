import s from './chat-heading.module.scss'
import { Link } from 'react-router-dom'
import arrowLeft from '../../../../../images/left-arrow.svg'
import { chatStore, userStore } from '../../../../../store/root-store'
import React from 'react'
import { observer } from 'mobx-react-lite'


export const ChatHeading = observer(() => {
  return (
    <>
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
    </>
  )
})
