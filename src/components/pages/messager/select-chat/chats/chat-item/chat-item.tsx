import { Message } from '../../../../../../types/chat'
import { NavLink } from 'react-router-dom'

type Props = {
  chatName: string
  lastMessage: Message | null
}
//TODO: как в вк

export const ChatItem = ({chatName, lastMessage}: Props) => {
  return (
    <NavLink to={chatName}>
      <h5>{chatName}</h5>
      {lastMessage && <p>{lastMessage.text}</p>}
    </NavLink>
  )
}
