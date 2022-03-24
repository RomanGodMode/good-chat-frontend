type Row = boolean[]
type Range = [number, number]

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

  if (from !== row.length - 1) {
    gaps.push([from + 1, row.length - 1])
  }

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
  const { gapLength, gap } = getLargestGap(row)
  const [from, to] = gap

  if (from === 0 || to === row.length - 1) {
    return gapLength + 1
  }

  return gapLength % 2 === 0
    ? Math.floor(gapLength / 2) + 1
    : Math.ceil(gapLength / 2) + 1
}

const row1: Row = [true, false, true, false, false, false, true]
console.log(getMaxDistanceFromClosest(row1))

const row2: Row = [true, false, true, false, false]
console.log(getMaxDistanceFromClosest(row2))

const row3: Row = [false, false, true, false, true, false]
console.log(getMaxDistanceFromClosest(row3))
