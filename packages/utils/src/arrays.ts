export const mapCompose = (
  array: any[],
  ...functions: ((...args) => any)[]
) => {
  return functions.reduce((array, fn) => {
    if (typeof fn === "function") {
      return array.map(fn)
    } else if (typeof fn === "undefined") {
      return array
    } else {
      throw new Error(
        `utils/compose, I expected a function here, got "${typeof fn}" instead...`
      )
    }
  }, array || [])
}
