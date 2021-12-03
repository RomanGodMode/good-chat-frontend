export const remove = <T>(array: T[], el: T) => {
  const index = array.indexOf(el)
  if (~array) {
    array.splice(index, 1)
  }
}
