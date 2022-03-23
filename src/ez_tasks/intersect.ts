const arr1 = [1, 2, 2, 1]
const arr2 = [2, 2, 1]

export const countOf = (arr: number[], value: number) => arr.filter(val => val === value).length

export const intersect = (arr1: number[], arr2: number[]) => arr1.reduce((acc, item) => {
  if (countOf(arr2, item) > countOf(acc, item)) {
    return [...acc, item]
  }

  return acc
}, [] as number[])


console.log(intersect(arr1, arr2))
