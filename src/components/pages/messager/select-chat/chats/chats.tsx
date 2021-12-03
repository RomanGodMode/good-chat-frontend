import { Loader } from '../../../../shared/loader/loader'
import { ChatItem } from './chat-item/chat-item'
import { observer } from 'mobx-react-lite'
import s from './chats.module.scss'
import { AnimatePresence } from 'framer-motion'
import { chatListStore } from '../../../../../store/root-store'

export const Chats = observer(() => {
  const {chats, isLoading} = chatListStore

  if (isLoading)
    return <Loader/>

  return (
    <div className={s.chats}>
      <AnimatePresence>
        {chats.map(chat => <ChatItem
          key={`${'initiator' in chat ? 'dialog' : 'group'} ${chat.id}`}
          chat={chat}
        />)}
      </AnimatePresence>
    </div>
  )
})


