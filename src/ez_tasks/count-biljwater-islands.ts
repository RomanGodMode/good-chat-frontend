type Tile = 'land' | 'water'
type Map = Tile[][]
type Point = [number, number]

const map: Map = [
  ['land', 'land', 'land', 'land', 'water'],
  ['land', 'land', 'water', 'water', 'water'],
  ['water', 'water', 'land', 'land', 'water'],
  ['water', 'water', 'water', 'water', 'water']
]

const foundIsland = (map: Map): Point | null => {
  for (let x = 0; x < map.length; x++) {
    const row = map[x]
    for (let y = 0; y < row.length; y++) {
      if (row[y] === 'land') {
        return [x, y]
      }
    }
  }

  return null
}

export const countIslands = (map: Map) => {
  map = map.map(row => row.map(tile => tile))

  const optionalErase = ([x, y]: Point) => {
    if (map[x]?.[y] && map[x][y] === 'land') {
      eraseIsland([x, y])
    }
  }

  function eraseIsland([x, y]: Point) {
    map[x][y] = 'water'
    optionalErase([x + 1, y])
    optionalErase([x - 1, y])
    optionalErase([x, y + 1])
    optionalErase([x, y - 1])
  }

  let count = 0
  while (true) {
    const islandLocation = foundIsland(map)
    if (!islandLocation) {
      return count
    }
    eraseIsland(islandLocation)
    count++
  }
}

console.log(countIslands(map))

