import { Message } from '../../../../../../types/chat'
import { NavLink } from 'react-router-dom'
import s from './chat-item.module.scss'

type Props = {
  chatName: string
  lastMessage: Message | null
}

export const ChatItem = ({chatName, lastMessage}: Props) => {
  return (
    <NavLink className={s.chatItem} to={chatName}>
      <h5>{chatName}</h5>
      {lastMessage && <p>{lastMessage.text}</p>}
    </NavLink>
  )
}
