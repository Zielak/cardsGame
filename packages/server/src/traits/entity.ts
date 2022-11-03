import { logs } from "@cardsgame/utils"
import { Schema } from "@colyseus/schema"

import { type } from "../annotations/type.js"
import type { State } from "../state/state.js"

// TODO: add generics, so we get types for hook names...
export function executeHook(hookName: string, ...args: any[]): void {
  const proto = Object.getPrototypeOf(this)
  const { hooks } = proto

  if (hooks && hooks.has(hookName)) {
    hooks.get(hookName).forEach((fn) => fn.apply(this, args))
  }
}

/**
 * @category Trait
 */
export class Entity<T> extends Schema {
  constructor(state: State, options: Partial<T> = {}) {
    super()

    const proto = Object.getPrototypeOf(this)

    // First, apply all traits and their "constructors"
    if (proto.traitsConstructors) {
      proto.traitsConstructors.forEach((fun) => {
        fun.call(this, state, options)
      }, this)
    }

    // Execute our Entity's `create` "constructor"
    this.create(state, options)

    // Execute `postConstructor` hooks
    this._executeHook("postConstructor", state, options)
  }

  private readonly _executeHook = executeHook

  create(state: State, options: Partial<T> = {}): void {
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
export const applyTraitsMixins =
  (baseCtors: any[]) =>
  (derivedCtor: AnyClass): void => {
    const derived = derivedCtor.prototype

    if (!Object.prototype.hasOwnProperty.call(derived, "traitsConstructors")) {
      Object.defineProperty(derived, "traitsConstructors", {
        value: [],
      })
    }
    if (!Object.prototype.hasOwnProperty.call(derived, "hooks")) {
      Object.defineProperty(derived, "hooks", {
        value: new Map(),
      })
    }

    baseCtors.forEach((baseCtor) => {
      Object.getOwnPropertyNames(baseCtor.prototype)
        .filter((name) => name !== "constructor")
        .forEach((name) => {
          Object.defineProperty(
            derived,
            name,
            Object.getOwnPropertyDescriptor(baseCtor.prototype, name)
          )
        })

      Object.getOwnPropertyNames(baseCtor).forEach((name) => {
        if (name === "typeDef") {
          for (const field in baseCtor.typeDef) {
            type(baseCtor.typeDef[field])(derived, field)
          }
        } else if (name === "trait") {
          derived.traitsConstructors.push(baseCtor.trait)
        } else if (name === "hooks" && typeof baseCtor.hooks === "object") {
          Object.keys(baseCtor.hooks).forEach((hookKey) => {
            if (!derived.hooks.has(hookKey)) {
              derived.hooks.set(hookKey, [])
            }
            derived.hooks.get(hookKey).push(baseCtor.hooks[hookKey])
          })
        }
      })
    })
  }
