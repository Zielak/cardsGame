export const noop = (): void => {}

/**
 * Executes function multiple times
 * @param length number of times function will be executed
 * @param func a function
 */
export const times = (length: number, func: (idx: number) => any): void => {
  Array.from({ length }, func)
}

// eslint-disable-next-line @typescript-eslint/ban-types
export const runAll = (functions: Function[]): void => {
  functions.forEach((fn) => fn())
}
