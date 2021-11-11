export const prevent = (handler: any) => (event: any) => {
  event.preventDefault()
  return handler(event)
}
