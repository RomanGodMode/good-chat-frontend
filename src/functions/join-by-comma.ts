export const joinByComma = <T>(arr: T[]) => {
  return arr.reduce((acc, curr) => [...acc, ', ', curr], [] as (T | string)[])
    .slice(1)
}
