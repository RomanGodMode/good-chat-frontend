import React, {useState} from 'react'
import {useChatSocket} from "../../../../hooks/use-chat-socket";

export const ChatPage = () => {
    const [newMessage, setNewMessage] = useState('')
    const {messages, sendMessage} = useChatSocket()

    return (
        <div>
            {messages.map((m: any) => <div>{m.text}</div>)}
            <form onSubmit={e => e.preventDefault()} className="sendMessage">
                <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)}/>
                <button onClick={_ => sendMessage(newMessage)}>Отправить</button>
            </form>
        </div>
    )
}
