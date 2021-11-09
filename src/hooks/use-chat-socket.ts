import {useEffect, useState} from "react"

let socket: WebSocket

const sendMessage = (text: string) => {
    const event = {
        type: 'send_message',
        text
    }
    socket.send(JSON.stringify(event))
}
export const useChatSocket = () => {
    const [messages, setMessages] = useState<any[]>([])

    useEffect(() => {
        socket = new WebSocket('ws://127.0.0.1:8000/chat/')

        socket.addEventListener('message', e => {
            const data = JSON.parse(e.data)
            if (data.type === 'receive_message') {
                console.log(data.message)
                setMessages(messages => [...messages, data.message])
            }
        })

        return () => {
            socket.close()
        }
    }, [])


    return {
        messages,
        sendMessage
    }
}
