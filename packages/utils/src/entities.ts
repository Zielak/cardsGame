/**
 * Finding function, for `find()` iteration
 *
 * @category Entity
 */
export const pickByIdx =
  (idx: number) =>
  (child: any): boolean =>
    child?.idx === idx

/**
 * Sorting function, for `sort()`
 *
 * @category Entity
 */
export const sortByIdx = (a: any, b: any): number => a?.idx - b?.idx
