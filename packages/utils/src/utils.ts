/**
 * Returns `def` if `value` wasn't provided
 * @param value provided from someplace else
 * @param def returned default if no `value` was provided
 */
export const def = <T>(value: T, def: T): T =>
  typeof value !== "undefined" ? value : def

export const noop = () => {}

/**
 * Call each function with the current argument and the result is use for the next call
 * @param initial value to be passed through the pipeline
 */
export const compose = (value: any, ...functions: ((...args) => any)[]) => {
  return functions.reduce((arg, fn) => {
    if (typeof fn === "function") {
      return fn(arg)
    } else if (typeof fn === "undefined") {
      return arg
    } else {
      throw new Error(
        `utils/compose, I expected a function here, got "${typeof fn}" instead...`
      )
    }
  }, value)
}

/**
 * Executes function multiple times
 * @param length number of times function will be exetuced
 * @param func a function
 */
export const times = (length: number, func: () => any) =>
  Array.from({ length }, func)

/**
 * Simple delay of execution. Use like this: `await timeout(50)`
 * @param ms mili seconds
 */
export const timeout = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))

/**
 * Check if a `thing` is just a literal object (using typeof), and not Array or anything else.
 * @param thing
 */
export const isObject = (thing: unknown): boolean => {
  if (typeof thing !== "object") {
    return false
  }
  if (Array.isArray(thing)) {
    return false
  }
  return true
}
