import { useQuery } from 'react-query'
import { chatApi, CHATS } from '../../../../../api/chats'
import { Loader } from '../../../../shared/loader/loader'
import { ChatItem } from './chat-item/chat-item'
import { observer } from 'mobx-react-lite'
import s from './chats.module.scss'

export const Chats = observer(() => {
  const {data: chats, isLoading} = useQuery(CHATS, chatApi.getAllChats)

  if (isLoading)
    return <Loader/>

  return (
    <div className={s.chats}>
      {chats?.map(chat => <ChatItem
        key={`${'initiator' in chat ? 'dialog' : 'group'} ${chat.id}`}
        chat={chat}
      />)}
    </div>
  )
})


