const bricksLengths = [
  [1, 2, 2, 1],
  [3, 1, 2],
  [1, 3, 2],
  [2, 4],
  [3, 1, 2],
  [1, 3, 1, 1]
]

const flat = (matrix: number[][]) => matrix.reduce((acc, row) => [...acc, ...row], [])

const getWall = (bricksLengths: number[][]) =>
  bricksLengths.map(row =>
    row.map(
      (len, index) => {
        const isLast = row.length - 1 === index
        return Array(len * 2 - (isLast ? 0 : 1)).fill('=')
          .join('') + (isLast ? '' : '|')
      }
    ).join('')
  )

console.log(getWall(bricksLengths))


export const getLowestBricksCleave = (bricksLengths: number[][]) => {
  const emptyPlacesLocations = bricksLengths.map(row => {
    let currentLocation = 0
    return row.map(length => currentLocation += length).slice(0, -1)
  })

  const getJointsCountInLocation = (location: number) => emptyPlacesLocations
    .filter(row => row.includes(location)).length

  const getCleaveCountInLocation = (location: number) => bricksLengths.length - getJointsCountInLocation(location)

  const locations = [...new Set(flat(emptyPlacesLocations))].sort()

  return Math.min(...locations.map(getCleaveCountInLocation))
}

console.log(getLowestBricksCleave(bricksLengths))
