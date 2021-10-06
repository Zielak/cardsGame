export const limit = (val: number, min = 0, max = 1): number =>
  val < min ? min : val > max ? max : val

// TODO: maybe allow negative values as min?
export const wrap = (val: number, max = 1): number => {
  if (max === 0) return val
  return ((val % max) + max) % max
}

export const rad2deg = (angle: number): number => {
  //  discuss at: http://locutus.io/php/rad2deg/
  // original by: Enrique Gonzalez
  // improved by: Brett Zamir (http://brett-zamir.me)
  //   example 1: rad2deg(3.141592653589793)
  //   returns 1: 180
  return angle * 57.29577951308232 // angle / Math.PI * 180
}

export const deg2rad = (angle: number): number => {
  //  discuss at: http://locutus.io/php/deg2rad/
  // original by: Enrique Gonzalez
  // improved by: Thomas Grainger (http://graingert.co.uk)
  //   example 1: deg2rad(45)
  //   returns 1: 0.7853981633974483
  return angle * 0.017453292519943295 // (angle / 180) * Math.PI;
}

export const cm2px = (value: number): number => value * 11.5
export const px2cm = (value: number): number => value / 11.5

/**
 * Limits the number of digits "after comma"
 */
export const decimal = (value: number, maxZeroes = 2): number => {
  const pow = Math.pow(10, maxZeroes)

  return Math.round(value * pow) / pow
}
