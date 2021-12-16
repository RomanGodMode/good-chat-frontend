import { useEffect, useState } from 'react'

export const usePopover = (popoverBlockClass: string) => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {

  }, [])

  return [isOpen, setIsOpen] as const
}
