const count = <T>(arr: T[], value: T) => arr.reduce((acc, cur) => cur === value ? acc + 1 : acc, 0)

export const luckyNumber = (num: number): number => {
  const splittedNum = num.toString().split('').map(Number)
  const uniqNums = [...new Set(splittedNum)].map(Number)
  const luckyNumbers = uniqNums.filter(uniqNum => uniqNum === count(splittedNum, uniqNum))

  return !luckyNumbers.length
    ? 0
    : Math.max(...luckyNumbers)

}

console.log(luckyNumber(12242444))
