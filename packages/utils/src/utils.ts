export const def = <T>(value: T, def: T): T =>
  typeof value !== "undefined" ? value : def

export const noop = () => {}

export const times = (length: number, func: () => any) =>
  Array.from({ length }, func)
