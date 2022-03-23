const heights = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]

export const createMatrix = (heights: number[]): boolean[][] => {
  const height = Math.max(...heights)

  return heights.map(h => [...Array(height)].map((_, idx) => idx < h))
}

console.log(createMatrix(heights))

export const calcWaterAmount = (heights: number[]): number => {


  return 2
}
