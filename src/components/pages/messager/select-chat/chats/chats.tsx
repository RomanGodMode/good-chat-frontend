import { useQuery } from 'react-query'
import { dialogsApi } from '../../../../../api/dialogs'
import { Loader } from '../../../../shared/loader/loader'
import { getInterlocutor } from '../../../../../functions/get-interlocutor'
import { ChatItem } from './chat-item/chat-item'
import { observer } from 'mobx-react-lite'
import { userStore } from '../../../../../store/root-store'
import s from './chats.module.scss'

export const Chats = observer(() => {
  const {data: dialogs, isLoading} = useQuery('dialogs', dialogsApi.getMyDialogs)

  if (isLoading)
    return <Loader/>

  return (
    <div className={s.chats}>
      {dialogs?.map(d => <ChatItem
        key={`dialog ${d.id}`}
        lastMessage={d.last_message}
        chatName={getInterlocutor(d, userStore.user?.id).username}
      />)}
    </div>
  )
})

