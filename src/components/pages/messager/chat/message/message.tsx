import { Message as MessageType } from '../../../../../types/chat'
import s from './message.module.scss'
import React from 'react'
import { motion } from 'framer-motion'
import { shift } from '../../../../../animations/shift'
import { observer } from 'mobx-react-lite'
import { getMessageStatus } from '../../../../../functions/get-message-status'


type Props = {
  message: MessageType
}


export const Message = observer(({message}: Props) => {
  const {isRead, isOwn} = getMessageStatus(message)

  return (
    <motion.div
      className={`${s.message} ${!isRead ? s.isUnread : ''} ${isOwn ? s.isOwn : ''}`}
      key={message.id}
      {...shift}
    >
      <p className={s.text}>{message.text}</p>
    </motion.div>
  )
})
