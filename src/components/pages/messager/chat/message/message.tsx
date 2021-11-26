import { Message as MessageType } from '../../../../../types/chat'
import s from './message.module.scss'
import { NavLink } from 'react-router-dom'
import React from 'react'
import { trimSeconds } from '../../../../../functions/trimSeconds'


type Props = {
  message: MessageType
}


export const Message = ({message}: Props) => {
  return (
    <div className={s.message} key={message.id}>
      <NavLink to="/" className={s.username}>{message.sender.username}</NavLink>
      <span className={s.sentAt}>{trimSeconds(message.sent_at)}</span>
      <p className={s.text}>{message.text}</p>
    </div>
  )
}
