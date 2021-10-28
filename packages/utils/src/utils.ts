/**
 * Returns first, *defined* value
 */
export const def = <T>(...values: T[]): T =>
  values.find((value) => typeof value !== "undefined")

/**
 * Calls each function with the current argument
 * and its result is used for the next call
 * @param initial value to be passed through the pipeline
 */
export const compose = <T>(
  value: unknown,
  ...functions: ((...args) => any)[]
): T => {
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
  }, value as T)
}

/**
 * Simple delay of execution. Use like this: `await timeout(50)`
 * @param ms milliseconds
 */
export const timeout = (ms: number): Promise<unknown> =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const isMap = (thing: unknown): thing is Map<any, any> => {
  try {
    // throws if o is not an object or has no [[MapData]]
    Map.prototype.has.call(thing)
    return true
  } catch (e) {
    return false
  }
}

/**
 * Has somewhat same interface to native Map
 */
export const isMapLike = (thing: unknown): boolean => {
  if (isMap(thing)) {
    return true
  } else {
    return (
      typeof thing === "object" &&
      "size" in thing &&
      typeof thing["size"] === "number" &&
      "get" in thing &&
      typeof thing["get"] === "function" &&
      "set" in thing &&
      typeof thing["set"] === "function"
    )
  }
}

export const isSet = (thing: unknown): thing is Set<any> => {
  try {
    // throws if o is not an object or has no [[SetData]]
    Set.prototype.has.call(thing)
    return true
  } catch (e) {
    return false
  }
}

/**
 * Check if a `thing` is just a literal object (using typeof), and not Array or anything else.
 * @deprecated never used and there are probably better ways of doing that
 * @param thing
 */
export const isObject = (thing: unknown): thing is Record<any, any> => {
  if (typeof thing !== "object") {
    return false
  }
  if (Array.isArray(thing) || isMap(thing) || isSet(thing)) {
    return false
  }
  return true
}

export function applyMixins(derivedCtor: AnyClass, baseCtors: any[]): void {
  baseCtors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name)
      )
    })
  })
}
