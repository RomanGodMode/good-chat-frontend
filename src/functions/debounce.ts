export const debounce = <T>(action: (args: T) => any, time: number): (args: T) => void => {
  let timeout = null as any | null

  return (...args) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => action(...args), time)
  }
}

// const log = debounce((num: number) => console.log(num), 5000)
//
// log()
// log()
// log()
