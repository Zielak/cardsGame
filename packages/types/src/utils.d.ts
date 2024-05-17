/* eslint-disable @typescript-eslint/no-explicit-any */

// eslint-disable-next-line @typescript-eslint/ban-types
interface AnyClass extends Function {
  new (...args: any[]): any
}

type AllowArrays<T> = { [prop in keyof T]: T[prop] | Array<T[prop]> }

// Author: https://stackoverflow.com/a/55479659/1404284
type NonFunctionPropertyNames<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T]: T[K] extends Function ? never : K
}[keyof T]
type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>

/**
 * Grabs type of array's items
 * @see https://stackoverflow.com/a/51399781
 */
type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never

type MapElement<MapType extends Map<any, unknown>> = MapType extends Map<
  any,
  infer ElementType
>
  ? ElementType
  : never

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T
