export function* generator(): Iterator<number | undefined, number, number> {
  yield 1

  const a = yield
  yield a

  return 42
}

const gen = generator()

console.log(gen.next())

console.log(gen.next())
console.log(gen.next(2))

console.log(gen.next())


const obj = { a: 1, b: 2 }
const str = 'sdads'
