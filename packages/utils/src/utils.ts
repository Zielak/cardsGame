export const def = <T>(value: T, def: T): T =>
  typeof value !== "undefined" ? value : def

export const noop = () => {}

export const times = (length: number, func: () => any) =>
  Array.from({ length }, func)

export const isObject = (thing: unknown): boolean => {
  if (typeof thing !== "object") {
    return false
  }
  if (Array.isArray(thing)) {
    return false
  }
  return true
}
