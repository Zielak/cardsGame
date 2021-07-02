/**
 * Finding function, for `find()` iteration
 */
export const pickByIdx = (idx: number) => (child: any): boolean =>
  child?.idx === idx

/**
 * Sorting function, for `sort()`
 */
export const sortByIdx = (a: any, b: any): number => a?.idx - b?.idx
