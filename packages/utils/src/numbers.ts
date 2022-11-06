/**
 * Limits `val` to fin within range from `min` to `max`
 *
 * @category Number
 */
export const limit = (val: number, min = 0, max = 1): number => {
  if (val < min) {
    return min
  } else if (val > max) {
    return max
  } else {
    return val
  }
}

/**
 * Wraps `val` around to fit within 0 and `max`
 *
 * @category Number
 */
// TODO: maybe allow negative values as min?
export const wrap = (val: number, max = 1): number => {
  if (max === 0) {
    return val
  } else {
    return ((val % max) + max) % max
  }
}

/**
 * Converts radians to degrees
 *
 * - discuss at: http://locutus.io/php/rad2deg/
 * - original by: Enrique Gonzalez
 * - improved by: Brett Zamir (http://brett-zamir.me)
 *
 * @example
 * ```ts
 * rad2deg(3.141592653589793)
 * // -> 180
 * ```
 *
 * @category Number
 */
export const rad2deg = (angle: number): number => {
  return angle * 57.29577951308232 // angle / Math.PI * 180
}

/**
 * Converts degrees to radians
 *
 * - discuss at: http://locutus.io/php/deg2rad/
 * - original by: Enrique Gonzalez
 * - improved by: Thomas Grainger (http://graingert.co.uk)
 *
 * @example
 * ```ts
 * deg2rad(45)
 * // -> 0.7853981633974483
 * ```
 *
 * @category Number
 */
export const deg2rad = (angle: number): number => {
  return angle * 0.017453292519943295 // (angle / 180) * Math.PI
}

/**
 *
 * @category Number
 */
export const cm2px = (value: number): number => value * 11.5

/**
 *
 * @category Number
 */
export const px2cm = (value: number): number => value / 11.5

/**
 * Limits the number of digits "after comma"
 *
 * @example
 * ```ts
 * decimal(10.12345, 2)
 * // -> 10.12
 * ```
 * @category Number
 */
export const decimal = (value: number, maxZeroes = 2): number => {
  const pow = Math.pow(10, maxZeroes)

  return Math.round(value * pow) / pow
}

/**
 *
 * @category Number
 */
export const lerp = (a: number, b: number, t: number): number => {
  return a * (1 - t) + b * t
}

/**
 *
 * @category Number
 */
export const distance = (
  ax: number,
  ay: number,
  bx: number,
  by: number
): number => {
  const dx = ax - bx
  const dy = ay - by
  return Math.sqrt(dx * dx + dy * dy)
}
