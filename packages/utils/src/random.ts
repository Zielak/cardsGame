/**
 * Random float number in range `min` to `max`
 * @category Random
 */
export const randomFloat = (min = 0, max = 1): number =>
  Math.random() * (max - min) + min

/**
 * Random number  in range `min` to `max`, without the remainder
 * @category Random
 */
export const randomInt = (min = 0, max = 1): number =>
  Math.floor(Math.random() * (max - min) + min)
