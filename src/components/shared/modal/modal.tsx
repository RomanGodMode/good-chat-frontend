import ReactModal from 'react-modal'
import { SetState } from '../../../types/utils'
import s from './modal.module.scss'
import { FC } from 'react'
import closeIcon from '../../../images/close.svg'

type Props = {
  isOpen: boolean
  setIsOpen: SetState<boolean>
  title: string
}


export const Modal: FC<Props> = ({isOpen, setIsOpen, children, title}) => {
  const close = () => setIsOpen(false)

  return (
    <ReactModal
      className={`${s.body} ${title ? s.hasTitle : ''}`} overlayClassName={s.overlay}
      ariaHideApp={false} onRequestClose={close}
      isOpen={isOpen}
    >
      {title && <h2 className={s.title}>{title}</h2>}
      <button onClick={close} className={s.close}><img src={closeIcon} alt=""/></button>
      {children}
    </ReactModal>
  )
}
