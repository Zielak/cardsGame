const SEP = {
  object: "$",
  array: "#",
}
const sepRegex = new RegExp(`([${SEP.array}${SEP.object}])`)

/**
 *
 * @param object
 * @param path array of object key name, or SEP symbol, indicating if new kind of object is needed to create
 * @param value
 * @returns
 */
function deepAssign(
  object: Record<string, any>,
  path: string[],
  value: unknown,
): void {
  if (path.length === 1) {
    // as deep as it gets, set the value
    object[path[0]] = value
    return
  }

  const key = path.shift()
  const sep = path.shift()

  if (sep === SEP.array) {
    if (object[key] === undefined) {
      object[key] = []
    } else if (!Array.isArray(object[key])) {
      throw new Error(
        `Expected to access via array "${path.join(
          ".",
        )} but it's ${typeof object[key]}"`,
      )
    }
  } else if (sep === SEP.object) {
    if (object[key] === undefined) {
      object[key] = {}
    } else if (typeof object[key] !== "object") {
      throw new Error(
        `Expected to access via object "${path.join(
          ".",
        )} but it's ${typeof object[key]}"`,
      )
    }
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
    const isPath = key.includes(SEP.array) || key.includes(SEP.object)

    if (!isPath) {
      result[key] = value[key]
    } else {
      deepAssign(result, key.split(sepRegex), value[key])
    }
  })

  return result as T
}
