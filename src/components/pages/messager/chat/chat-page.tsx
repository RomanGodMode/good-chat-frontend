import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { chatStore } from '../../../../store/chat-store'

export const ChatPage = observer(() => {
    const [newMessage, setNewMessage] = useState('')

    return (
      <div>
        {chatStore.messages.map((m: any) => <div>{m.text}</div>)}
        <form onSubmit={e => e.preventDefault()} className="sendMessage">
          <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)}/>
          <button onClick={_ => chatStore.sendMessage(newMessage)}>Отправить</button>
        </form>
      </div>
    )
}
)
