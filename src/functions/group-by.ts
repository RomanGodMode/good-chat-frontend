import { Obj } from '../types/utils'

type Group<T, V> = {
  values: T[]
} & V

const compareGroups = (group1: Obj, group2: Obj) => {
  for (const key in group1) {

    if (key !== 'values' && group1[key] !== group2[key]) {
      return false
    }
  }

  return true
}


export const groupBy = <T, V extends object>(arr: T[], by: (item: T) => V) => {
  const groups = [] as Group<T, V>[]
  arr.forEach(item => {
    const group = by(item)
    const oldGroup = groups.find(g => compareGroups(g, group))
    if (!oldGroup) {
      return groups.push({...group, values: [item]})
    }
    oldGroup.values.push(item)
  })

  return groups
}

const messages = [
  {text: '1', user: {name: 'рома'}, time: 2},
  {text: '2', user: {name: 'рома'}, time: 2},
  {text: 'папаша', user: {name: 'саня'}, time: 2}
]

groupBy(messages, ({user, time}) => ({username: user.name, time}))

