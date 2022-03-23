type Dict<V> = {
  [key: string]: V;
}

const getKey = (obj: Dict<string>, value: string) => Object.keys(obj)
  .find(key => obj[key] === value)

const brackets = {
  '{': '}',
  '(': ')',
  '[': ']'
}

const isOpeningBracket = (sym: string) => Object.keys(brackets).includes(sym)
const isClosingBracket = (sym: string) => Object.values(brackets).includes(sym)

const getOpeningBracket = (closingBracket: string) => getKey(brackets, closingBracket)


export const validateBrackets = (input: string): boolean => {
  const bracketsEntries = []

  for (const sym of input) {
    if (isOpeningBracket(sym)) {
      bracketsEntries.push(sym)
    } else if (isClosingBracket(sym)) {
      const lastOpenedBracket = bracketsEntries.pop()
      if (lastOpenedBracket !== getOpeningBracket(sym)) {
        return false
      }
    }
  }

  return true
}

const brackets1 = '([)]{}'

console.log(validateBrackets(brackets1))

const brackets2 = '{[{} {}]}'
console.log(validateBrackets(brackets2))
