import { Chat } from '../../../../../../types/chat'
import { NavLink } from 'react-router-dom'
import s from './chat-item.module.scss'
import { userStore } from '../../../../../../store/root-store'

type Props = {
  chat: Chat
}

export const ChatItem = ({chat}: Props) => {
  const isDialog = 'initiator' in chat

  const chatName = isDialog
    ? userStore.getInterlocutor(chat).username
    : chat.title

  return (
    <NavLink className={s.chatItem} to={isDialog ? `dialog/${chat.id}` : `group/${chat.id}`}>
      <h5>{chatName}</h5>
      {chat.last_message && <div className={`${s.lastMessage} ${s.unread}`}>
        {/*{JSON.stringify(chat.last_message, null, 2)}*/}
        <h4 className={s.user}>{chat.last_message.sender.username}: </h4>
        <p className={s.text}>{chat.last_message.text}</p>
      </div>}
    </NavLink>
  )
}

