export const deepClone = (value: unknown): any => {
  if (typeof value === "function") {
    return value
  }

  if (Array.isArray(value)) {
    const arrResult = []
    value.forEach((v) => arrResult.push(deepClone(v)))
    return arrResult
  }
  if (typeof value === "object") {
    const objResult = {}
    Object.keys(value).forEach(
      (key) => (objResult[key] = deepClone(value[key]))
    )
    return objResult
  }

  return value
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
