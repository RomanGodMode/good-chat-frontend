import { Chat } from '../../../../../../types/chat'
import { NavLink } from 'react-router-dom'
import s from './chat-item.module.scss'
import { userStore } from '../../../../../../store/root-store'
import { motion } from 'framer-motion'
import { shift } from '../../../../../../animations/shift'

type Props = {
  chat: Chat
}

export const ChatItem = ({chat}: Props) => {
  const isDialog = 'initiator' in chat

  const chatName = isDialog
    ? userStore.getInterlocutor(chat).username
    : chat.title

  return (
    <motion.div className={s.chatItem} {...shift}>
      <NavLink className={s.chatLink} to={isDialog ? `dialog/${chat.id}` : `group/${chat.id}`}>
        <h5 className={s.chatTitle}>{chatName}</h5>
        {chat.last_message && <div className={`${s.lastMessage} ${s.unread}`}>
          <h4 className={s.user}>{chat.last_message.sender.username}: </h4>
          <p className={s.text}>{chat.last_message.text}</p>
        </div>}
      </NavLink>
    </motion.div>
  )
}

