/**
 * Returns first, *defined* value
 * @example
 * ```ts
 * const options = {}
 *
 * def(options.value, "default")
 * // -> "default"
 * ```
 * @category Util
 */
export const def = <T>(...values: T[]): T =>
  values.find((value) => typeof value !== "undefined")

/**
 * Calls each function with the current argument
 * and its result is used for the next call
 * @param initial value to be passed through the pipeline
 * @category Util
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
        `utils/compose, I expected a function here, got "${typeof fn}" instead...`,
      )
    }
  }, value as T)
}

/**
 * Simple delay of execution. Use like this: `await timeout(50)`
 * @param ms milliseconds
 * @category Util
 */
export const timeout = (ms: number): Promise<unknown> =>
  new Promise((resolve) => setTimeout(resolve, ms))

/**
 * @category Util
 */
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
 * @category Util
 */
export const isMapLike = (thing: unknown): thing is Map<any, any> => {
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

/**
 * @category Util
 */
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
 * @category Util
 */
export function applyMixins(derivedCtor: AnyClass, baseCtors: any[]): void {
  baseCtors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name),
      )
    })
  })
}
