/**
 * Runs every provided function on `array` using .map(), ignores every function which turns out to be `undefined` instead.
 * @throws if one of arg1+ turn out to be something other than Function or undefined.
 */
export const mapCompose = (
  array: any[],
  ...functions: ((...args) => any)[]
): any[] => {
  return functions.reduce((prevArr, fn, idx) => {
    if (typeof fn === "function") {
      return prevArr.map(fn)
    } else if (typeof fn === "undefined" || fn === false) {
      return prevArr
    } else {
      throw new Error(
        `utils/mapCompose, I expected a function at arg${
          idx + 1
        }, got "${typeof fn}" instead...`
      )
    }
  }, array || [])
}

/**
 * Function for `array.sort()`.
 */
export const sortAlphabetically = (a: string, b: string): number =>
  a < b ? -1 : a > b ? 1 : 0

/**
 * Function for `array.sort()`.
 */
export const sortAlphaNumerically = (a: string, b: string): number => {
  const numA = parseInt(a) || false
  const numB = parseInt(b) || false

  if (numA !== false && numB !== false) {
    return numA - numB
  }
  return a < b ? -1 : a > b ? 1 : 0
}

/**
 * Returns new array with items shuffled around.
 */
export const shuffle = (array: any[]): any[] => {
  const res = [...array]
  for (let i = res.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = res[i]
    res[i] = res[j]
    res[j] = temp
  }
  return res
}

/**
 *
 * @param count
 */
export const arrayWith = (count: number): any[] => [...Array(count).keys()]

/**
 * Grabs you most common "propKey" in your collection of `T`,
 * filtering out items which match given optional condition.
 * @returns a tuple of [`propValue`, `count`]
 */
export function pickMostCommonProp<T = any>(
  collection: T[],
  propKey: string,
  condition?: (T) => boolean
): [any, number] {
  const map: Map<string, number> = new Map()

  collection
    .filter((item) => (condition ? condition(item) : true))
    .filter((item) => propKey in item)
    .forEach((item) => {
      map.has(item[propKey])
        ? map.set(item[propKey], map.get(item[propKey]) + 1)
        : map.set(item[propKey], 1)
    })

  const mostCommonProp: [string, number] = [undefined, 0]
  map.forEach((count, propKey) => {
    if (count > mostCommonProp[1]) {
      mostCommonProp[0] = propKey
      mostCommonProp[1] = count
    }
  })

  return mostCommonProp
}
