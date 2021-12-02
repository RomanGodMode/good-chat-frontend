import { useEffect, useState } from 'react'

export const useOnce = <T>(action: Function, when: T) => {
  const [isFulfilled, setIsFulfilled] = useState(false)

  useEffect(() => {
    if (when && !isFulfilled) {
      action()
      setIsFulfilled(true)
    }
  }, [when]) //eslint-disable-line
}
