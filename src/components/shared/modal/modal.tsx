import { SetState } from '../../../types/utils'
import s from './modal.module.scss'
import { FC } from 'react'
import closeIcon from '../../../images/close.svg'
import { AnimatePresence, motion } from 'framer-motion'

type Props = {
  isOpen: boolean
  setIsOpen: SetState<boolean>
  title: string
}


export const Modal: FC<Props> = ({isOpen, setIsOpen, children, title}) => {

  const close = () => setIsOpen(false)

  return (
    <AnimatePresence>
      {isOpen ? <motion.div
        className={s.overlay} onClick={close}
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
      >
        <motion.div
          className={`${s.body} ${title ? s.hasTitle : ''}`} onClick={e => e.stopPropagation()}
          initial={{y: '-100vh', opacity: 0}}
          animate={{
            y: 0,
            opacity: 1,
            transition: {type: 'spring', duration: 0.3, damping: 20, stiffness: 420}
          }}
          exit={{y: '100vh', opacity: 0}}
        >
          {title && <h2 className={s.title}>{title}</h2>}
          <button onClick={close} className={s.close}><img src={closeIcon} alt=""/></button>
          {children}
        </motion.div>
      </motion.div> : null}
    </AnimatePresence>
  )
}
