const quotes = [7, 1, 5, 3, 6, 4]

export const getMaxStonks = (quotes: number[]) =>
  quotes.reduce((acc, currentQuote, index) => {
      const prevQuote = quotes[index - 1]
      if (prevQuote && prevQuote < currentQuote) {
        const stonks = currentQuote - prevQuote
        return acc + stonks
      }
      return acc
    }
    , 0)

console.log(getMaxStonks(quotes))
