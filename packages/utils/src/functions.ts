/**
 * @category Function
 */
export const noop = (): void => {
  // It's a noop, leave it be
}

/**
 * Executes function multiple times
 * @param length number of times function will be executed
 * @param func a function
 * @category Function
 */
export const times = (length: number, func: (idx: number) => any): void => {
  Array.from({ length }, func)
}

/**
 * @param functions Array of functions to call one by one
 *
 * @category Function
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const runAll = (functions: Function[]): void => {
  functions.forEach((fn) => fn())
}
