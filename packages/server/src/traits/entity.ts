import { Schema } from "@colyseus/schema"

import { type } from "../annotations"
import { State } from "../state"
import { logs } from "@cardsgame/utils"

export class Entity<T> extends Schema {
  constructor(state: State, options: Partial<T> = {}) {
    super()

    const postConstructor: Function[] = []

    // First, apply all traits and their "constructors"
    Object.getPrototypeOf(this).traitsConstructors.forEach(fun => {
      const callback = fun.call(this, state, options)

      // Gather every callback of traits, if they provided any
      if (callback && typeof callback === "function") {
        postConstructor.push(callback)
      }
    }, this)

    // Execute our Entity's `create` "constructor"
    this.create(state, options)

    // Execute callbacks from traits
    postConstructor.forEach(cb => cb())
  }

  create(state: State, options: Partial<T> = {}) {
    logs.warn(
      `Entity`,
      `"${this.constructor.name}" instance doesn't have its own 'create()' method`
    )
  }
}

/**
 * Mixes all the base constructors prototypes into one.
 * Also provides a way for Entity to automatically execute
 * all of the base constructor's "Trait Constructors".
 * @param derivedCtor
 * @param baseCtors
 */
export const applyMixins = (baseCtors: any[]) => (derivedCtor: Function) => {
  if (!derivedCtor.prototype.hasOwnProperty("traitsConstructors")) {
    Object.defineProperty(derivedCtor.prototype, "traitsConstructors", {
      value: []
    })
  }

  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype)
      .filter(name => name !== "constructor")
      .map(name => {
        Object.defineProperty(
          derivedCtor.prototype,
          name,
          Object.getOwnPropertyDescriptor(baseCtor.prototype, name)
        )
      })

    Object.getOwnPropertyNames(baseCtor).map(name => {
      if (name === "typeDef") {
        for (var field in baseCtor.typeDef) {
          type(baseCtor.typeDef[field])(derivedCtor.prototype, field)
        }
      } else if (name === "trait") {
        derivedCtor.prototype.traitsConstructors.push(baseCtor.trait)
      }
    })
  })
}
