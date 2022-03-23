type Row = boolean[]
type Range = [number, number]
const row: Row = [true, false, true, false, false, false, false, false, true]

const getGaps = (row: Row) => {
  const gaps: Range[] = []
  let from = -1

  row.forEach((isOccupied, index) => {
    if (isOccupied) {
      if (index !== 0) {
        gaps.push([from + 1, index - 1])
      }
      from = index
    }
  })

  return gaps
}

const getLargestGap = (row: Row) => {
  const gaps = getGaps(row)

  let largestGap: Range | null = null
  let maxGapLength = 0

  gaps.forEach(gap => {
    const [from, to] = gap
    const gapLength = to - from

    if (gapLength > maxGapLength) {
      maxGapLength = gapLength
      largestGap = gap
    }
  })

  return {
    gap: largestGap!,
    gapLength: maxGapLength + 1
  }
}

export const getMaxDistanceFromClosest = (row: Row) => {
  const { gapLength } = getLargestGap(row)
  return gapLength % 2 === 0
    ? Math.floor(gapLength / 2) + 1
    : Math.ceil(gapLength / 2) + 1
}

console.log(getMaxDistanceFromClosest(row))
