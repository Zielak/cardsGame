import type { Presence } from "@colyseus/core"

import type { State } from "../state/state.js"

import { Room } from "./base.js"
import type { RoomDefinition } from "./roomType.js"

export declare type RoomConstructor<
  S extends State,
  R extends Room<S> = Room<S>
> = new (presence?: Presence) => R

/**
 *
 * @param name
 * @param definition
 * @returns
 *
 * @category Room
 */
export function defineRoom<S extends State, R extends Room<S> = Room<S>>(
  name: string,
  definition: RoomDefinition<S>
): RoomConstructor<S, R> {
  const klass = new Function(
    "baseClass",
    `return class ${name} extends baseClass {}`
  )(Room) as RoomConstructor<S, R>

  Object.entries(definition).forEach(([key, value]) => {
    // console.log(key, value)q
    klass.prototype[key] = value
  })

  return klass
}
