export const calcWaterAmount = (heights: number[]): number => heights.reduce(
  (waterAmount, height, index) => {
    const leftBorder = Math.max(...heights.slice(0, index), 0)
    const rightBorder = Math.max(...heights.slice(index + 1), 0)

    let amount = Math.min(leftBorder, rightBorder) - height
    amount = Math.max(amount, 0)

    return waterAmount + amount
  }, 0)

// const heights = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]
const heights = [5, 0, 4, 0, 1, 5, 0, 3]
console.log(calcWaterAmount(heights))

//https://www.youtube.com/watch?v=2xZq8z_A-NQ&list=WL&index=4&t=85s
