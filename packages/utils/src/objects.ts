/**
 *
 * @category Object
 */
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
 * @returns new object without provided `keys`
 * @category Object
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

/**
 * @returns new object only with provided `keys`
 * @category Object
 */
export const pick = (
  object: Record<string, any>,
  keys: string[]
): Record<string, any> =>
  Object.keys(object)
    .filter((key) => keys.includes(key))
    .reduce((obj, key) => {
      obj[key] = object[key]
      return obj
    }, {} as Record<string, any>)

/**
 * Resolves target object/property given source object and path.
 * @category Object
 */
export const resolve = (
  sourceObject: Record<string, any>,
  path: (string | number)[] | string,
  separator = "."
): any => {
  const properties = Array.isArray(path) ? path : path.split(separator)
  return properties.reduce((prev, curr) => prev && prev[curr], sourceObject)
}
