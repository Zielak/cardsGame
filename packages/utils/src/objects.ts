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
