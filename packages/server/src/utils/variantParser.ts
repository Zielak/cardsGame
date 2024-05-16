function deepAssign(
  object: Record<string, any>,
  path: string[],
  value: unknown,
): void {
  if (path.length === 1) {
    // as deep as it gets, set
    object[path[0]] = value
    return
  }

  const key = path.shift()

  if (object[key] === undefined) {
    object[key] = {}
  } else if (typeof object[key] !== "object") {
    throw new Error(
      `Expected to access "${path.join(".")} but it's of type ${typeof object[
        key
      ]}"`,
    )
  }

  deepAssign(object[key], path, value)
}

export const variantParser = <T extends Record<string, unknown>>(
  value: unknown,
): T => {
  // Expected flat object of props. Possible sub objects with dot notation

  if (typeof value !== "object") {
    throw new Error("Variant data not an object, cannot parse")
  }

  const result = {}

  Object.keys(value).forEach((key) => {
    const isPath = key.includes("$")

    if (!isPath) {
      result[key] = value[key]
    } else {
      deepAssign(result, key.split("$"), value[key])
    }
  })

  return result as T
}
