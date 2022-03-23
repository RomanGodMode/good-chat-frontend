const append = (obj: any, keys: string[]) => {
  const key = keys[0]
  if (key) {
    if (!(key in obj)) {
      obj[key] = {}
    }
    append(obj[key], keys.slice(1))
  }
}

const get = (obj: any, keys: string[]): any => {
  const key = keys[0]

  if (key) {
    return get(obj[key], keys.slice(1))
  } else {
    return obj
  }
}

export const objectifyQuery = (query: string): object => {
  const result = {} as any
  const pairs = query.split('&')
    .map(raw => raw.split('='))

  pairs.forEach(([longKey, value]) => {
    const splittedKeys = longKey.split('.')
    const path = splittedKeys.slice(0, -1)
    append(result, path)

    const endKey = splittedKeys[splittedKeys.length - 1]
    get(result, path)[endKey] = value
  })

  return result
}

const query = 'user.name=Bob&user.lastname=Adams'

console.log(objectifyQuery(query))

