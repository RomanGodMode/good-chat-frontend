type Point = { x: number, y: number }
type Tile = 1 | 0
type Maze = Tile[][]

export const canPass = (maze: Maze, start: Point, end: Point) => {
  maze = maze.map(row => row.map(tile => tile))
  const walk = (to: Point): boolean => {
    if (maze[to.x]?.[to.y] === undefined) {
      return false
    }

    const isBlock = !!maze[to.x][to.y]

    if (end.x === to.x && end.y === to.y) {
      return true
    }

    if (isBlock) {
      return false
    }

    maze[to.x][to.y] = 1

    return tryWalk(to, 1, 0)
      || tryWalk(to, -1, 0)
      || tryWalk(to, 0, 1)
      || tryWalk(to, 0, -1)
  }

  function tryWalk(current: Point, dx: number, dy: number) {
    return walk({
      x: current.x + dx,
      y: current.y + dy
    })
  }

  return walk(start)
}

const maze: Maze = [
  [1, 1, 1, 0, 0, 1],
  [1, 1, 1, 1, 0, 1],
  [0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 0]
]
console.log(canPass(maze, { x: 3, y: 0 }, { x: 5, y: 5 }))

const maze2: Maze = [
  [0, 1],
  [1, 0]
]
console.log(canPass(maze2, { x: 0, y: 0 }, { x: 1, y: 1 }))

// Условие: https://www.youtube.com/watch?v=3LzEOFdSk6g&list=WL&index=2&t=88s
