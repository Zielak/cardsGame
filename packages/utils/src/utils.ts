/**
 * Returns `def` if `value` wasn't provided
 * @param value provided from someplace else
 * @param def returned default if no `value` was provided
 */
export const def = <T>(value: T, def: T): T =>
  typeof value !== "undefined" ? value : def

export const noop = () => {}

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
