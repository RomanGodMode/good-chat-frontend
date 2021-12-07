import { chatStore } from '../../../../../store/root-store'
import s from './chat-messages.module.scss'
import { AnimatePresence, motion } from 'framer-motion'
import { shift } from '../../../../../animations/shift'
import { NavLink } from 'react-router-dom'
import { Message } from '../message/message'
import React from 'react'
import { observer } from 'mobx-react-lite'

export const ChatMessages = observer(() => {
  return (
    <AnimatePresence>
      {
        !chatStore.messages.length
          ? <h3 className={s.emptyMessages}>You haven't written anything yet..</h3>
          : <div className={s.messageGroups}>
            {
              chatStore.groupedMessages.map(({username, moment, values: messages}) =>
                <motion.div {...shift} className={s.messageGroup} key={`${username} ${moment}`}>
                  <NavLink to="/" className={s.username}>{username}</NavLink>
                  <span className={s.sentAt}>{moment}</span>
                  <div className={s.messages}>
                    {messages.map(m => <Message key={m.id} message={m}/>)}
                  </div>
                </motion.div>)
            }
          </div>
      }
    </AnimatePresence>
  )
})
