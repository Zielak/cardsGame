/**
 * Random float number
 */
export const randomFloat = (min = 0, max = 1): number =>
  Math.random() * (max - min) + min

/**
 * Random number without the rest
 */
export const randomInt = (min = 0, max = 1): number =>
  Math.floor(Math.random() * (max - min) + min)
