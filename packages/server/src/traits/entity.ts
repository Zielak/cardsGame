import { Schema } from "@colyseus/schema"
import { State } from "../state"

export class Entity<T> extends Schema {
  constructor(state: State, options: Partial<T> = {}) {
    super()

    Object.getPrototypeOf(this).traitsConstructors.forEach(fun => {
      fun.call(this, state, options)
    }, this)
  }
}

/**
 * Mixes all the base constructors prototypes into one.
 * Also provides a way for Entity to automatically execute
 * all of the base constructor's "Trait Constructors".
 * @param derivedCtor
 * @param baseCtors
 */
export const applyMixins = (derivedCtor: any, baseCtors: any[]) => {
  if (!derivedCtor.prototype.hasOwnProperty("traitsConstructors")) {
    Object.defineProperty(derivedCtor.prototype, "traitsConstructors", {
      value: []
    })
  }

  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      if (name === "constructor") {
        derivedCtor.prototype.traitsConstructors.push(
          baseCtor.prototype.constructor
        )
      }
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name)
      )
    })
  })
}
