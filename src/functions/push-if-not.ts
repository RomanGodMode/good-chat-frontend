import { action } from 'mobx'

export const pushIfNot = action('pushIfNot', <T>(arr: T[], value: T) =>
  !arr.includes(value) && arr.push(value))
