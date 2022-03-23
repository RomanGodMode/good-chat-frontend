export type Interval = [number, number]

const isIntersect = (interval1: Interval, interval2: Interval) => {
  return interval1[1] >= interval2[0]
}

const merge = (interval1: Interval, interval2: Interval): Interval => {
  return [interval1[0], interval2[1]]
}

export const mergeIntervals = (intervals: Interval[]) =>
  intervals.slice(1)
    .reduce((acc, interval, prevIndex) => {
      const prevInterval = intervals[prevIndex]
      if (!isIntersect(prevInterval, interval)) {
        return [...acc, interval]
      }

      return [...acc.slice(0, -1), merge(prevInterval, interval)]
    }, [intervals[0]] as Interval[])

const intervals: Interval[] = [
  [0, 1],
  [2, 4],
  [2, 6],
  [8, 10],
  [9, 18]
]

console.log(mergeIntervals(intervals))
