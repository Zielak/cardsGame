import { Schema } from "@colyseus/schema"
import { State } from "../state"

export class Entity extends Schema {
  id: EntityID

  constructor(state: State, options?) {
    super()

    if (state) {
      this.id = state.registerEntity(this)
    } else {
      this.id = -1
    }
    Object.getPrototypeOf(this).traitsConstructors.forEach(fun => {
      console.log(fun)
      fun.call(this, state, options)
    })
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
  if (!derivedCtor.traitsConstructors) {
    derivedCtor.traitsConstructors = []
  }

  baseCtors.forEach(baseCtor => {
    // if (baseCtor.constructor !== Object.constructor) {
    // const derivedProto = Object.getPrototypeOf(derivedCtor)
    derivedCtor.traitsConstructors.push(baseCtor.constructor)
    // }

    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name)
      )
    })
  })
}
