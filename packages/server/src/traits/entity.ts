import { Schema } from "@colyseus/schema"

import { logs } from "@cardsgame/utils"

import { type } from "../annotations"
import { State } from "../state"

export function executeHook(hookName: string, ...args) {
  logs.verbose("executeHook", hookName)
  const proto = Object.getPrototypeOf(this)
  const { hooks } = proto

  if (hooks && hooks.has(hookName)) {
    hooks.get(hookName).forEach(fn => fn.apply(this, args))
  }
}

export class Entity<T> extends Schema {
  constructor(state: State, options: Partial<T> = {}) {
    super()

    const proto = Object.getPrototypeOf(this)

    // First, apply all traits and their "constructors"
    if (proto.traitsConstructors) {
      proto.traitsConstructors.forEach(fun => {
        fun.call(this, state, options)
      }, this)
    }

    // Execute our Entity's `create` "constructor"
    this.create(state, options)

    // Execute `postConstructor` hooks
    this._executeHook("postConstructor", state, options)
  }

  _executeHook = executeHook

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
  const derived = derivedCtor.prototype

  if (!derived.hasOwnProperty("traitsConstructors")) {
    Object.defineProperty(derived, "traitsConstructors", {
      value: []
    })
  }
  if (!derived.hasOwnProperty("hooks")) {
    Object.defineProperty(derived, "hooks", {
      value: new Map()
    })
  }

  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype)
      .filter(name => name !== "constructor")
      .forEach(name => {
        Object.defineProperty(
          derived,
          name,
          Object.getOwnPropertyDescriptor(baseCtor.prototype, name)
        )
      })

    Object.getOwnPropertyNames(baseCtor).forEach(name => {
      if (name === "typeDef") {
        for (var field in baseCtor.typeDef) {
          type(baseCtor.typeDef[field])(derived, field)
        }
      } else if (name === "trait") {
        derived.traitsConstructors.push(baseCtor.trait)
      } else if (name === "hooks" && typeof baseCtor.hooks === "object") {
        Object.keys(baseCtor.hooks).forEach(hookKey => {
          if (!derived.hooks.has(hookKey)) {
            derived.hooks.set(hookKey, [])
          }
          derived.hooks.get(hookKey).push(baseCtor.hooks[hookKey])
        })
      }
    })
  })
}
