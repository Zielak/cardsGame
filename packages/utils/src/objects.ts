export const deepClone = (object: any) => {
  if (typeof object === "function") {
    return object
  }

  if (Array.isArray(object)) {
    const result = []
    object.forEach((v) => result.push(deepClone(v)))
    return result
  }
  if (typeof object === "object") {
    const result = {}
    Object.keys(object).forEach((key) => (result[key] = deepClone(object[key])))
  }

  return object
}

/**
 * @returns an object without provided `keys`
 */
export const omit = (
  object: Record<string, any>,
  keys: string[]
): Record<string, any> =>
  Object.keys(object)
    .filter((key) => !keys.includes(key))
    .reduce((obj, key) => {
      obj[key] = object[key]
      return obj
    }, {} as Record<string, any>)
