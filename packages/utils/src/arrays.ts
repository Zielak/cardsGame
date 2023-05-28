/**
 * Returns the last item of an array
 *
 * @category Array
 */
export const lastItem = <T = any>(array: T[]): T => {
  return Array.isArray(array) ? array[array.length - 1] : undefined
}

/**
 * Compares if two arrays contain same elements.
 *
 * @category Array
 */
export const compare = (arrayA: any[], arrayB: any[]): boolean =>
  arrayA.length === arrayB.length && arrayA.every((a) => arrayB.includes(a))

/**
 * Function for `array.sort()`.
 *
 * @category Array
 */
export const sortAlphabetically = (a: string, b: string): number => {
  if (a < b) {
    return -1
  } else if (a > b) {
    return 1
  } else return 0
}

/**
 * Function for `array.sort()`.
 *
 * @category Array
 */
export const sortAlphaNumerically = (a: string, b: string): number => {
  const numA = parseInt(a) || false
  const numB = parseInt(b) || false

  if (numA !== false && numB !== false) {
    return numA - numB
  }
  if (a < b) {
    return -1
  } else if (a > b) {
    return 1
  } else return 0
}

/**
 * Returns new array with items shuffled around.
 *
 * @category Array
 */
export const shuffle = <T = any>(array: T[]): T[] => {
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
 * Returns an array which holds `count` items, each being the index
 * number starting from 0.
 * @param count
 *
 * @category Array
 */
export const arrayWith = (count: number): number[] => [...Array(count).keys()]

/**
 * Grabs you most common `propKey` in your `collection` of `T`,
 * additionally filtering out items which match given optional condition.
 *
 * Most useful when creating [`BotNeurons`](/api/server/interfaces/BotNeuron)
 *
 * @returns a tuple of [`propValue`, `count`]
 * @example
 * ```ts
 * const [rank] = pickMostCommonProp(myCards, "rank")
 * ```
 * @category Array
 */
export function pickMostCommonProp<T extends object>(
  collection: T[],
  propKey: string,
  condition?: (arg0: T) => boolean
): [string, number] {
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
  map.forEach((count, key) => {
    if (count > mostCommonProp[1]) {
      mostCommonProp[0] = key
      mostCommonProp[1] = count
    }
  })

  return mostCommonProp
}
