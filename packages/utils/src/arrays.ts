export const mapCompose = (
  array: any[],
  ...functions: ((...args) => any)[]
) => {
  return functions.reduce((prevArr, fn) => {
    if (typeof fn === "function") {
      return prevArr.map(fn)
    } else if (typeof fn === "undefined") {
      return prevArr
    } else {
      throw new Error(
        `utils/compose, I expected a function here, got "${typeof fn}" instead...`
      )
    }
  }, array || [])
}

export const sortAlphabetically = (a: string, b: string) =>
  a < b ? -1 : a > b ? 1 : 0

export const arrayWith = (count: number) => [...Array(count).keys()]
