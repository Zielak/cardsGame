import { Schema } from "@colyseus/schema"

import { type } from "@/annotations/type.js"
import type { State } from "@/state/state.js"

import { logs } from "../logs.js"

import {
  ClassWithIED,
  ENTITY_INTERNAL_KEY,
  InternalEntityData,
} from "./entity/types.js"

/**
 * @param hookName
 * @param args
 * TODO: add generics, so we get types for hook names...
 * @ignore
 */
export function executeHook(hookName: string, ...args: any[]): void {
  const internal: InternalEntityData =
    Object.getPrototypeOf(this)[ENTITY_INTERNAL_KEY]
  const { hooks } = internal

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

    const internal: InternalEntityData =
      Object.getPrototypeOf(this)[ENTITY_INTERNAL_KEY]

    const colyDescriptors = this._definition.descriptors

    // Attach all trait's properties
    Object.getOwnPropertyNames(internal.localPropDescriptor)
      .filter((name) => internal.localPropDescriptor[name])
      .forEach((name) => {
        const local = internal.localPropDescriptor[name]
        const colyDescriptor = colyDescriptors[name]

        if (colyDescriptor) {
          // Both local and external/coly are defined => merge
          Object.defineProperty(this, name, {
            get: local.get,
            set: (v) => {
              local.set.call(this, v)
              colyDescriptor.set.call(this, local.get.call(this))
            },
            enumerable: true,
            configurable: true,
          })
        } else {
          // external/coly is not defined => use local as-is
          Object.defineProperty(this, name, local)
        }
      })

    // Apply `create` "constructors" of all traits
    internal.traitsConstructors?.forEach((fun) => {
      fun.call(this, state, options)
    }, this)

    // Execute our Entity's `create` "constructor"
    this.create(state, options)

    // Execute `postConstructor` hooks
    this._executeHook("postConstructor", state, options)
  }

  private readonly _executeHook = executeHook

  create(state: State, options: Partial<T> = {}): void {
    logs.log(
      `Entity`,
      `"${this.constructor.name}" instance doesn't have its own 'create()' method`,
    )
  }
}

/**
 * Mixes all the base constructors prototypes into one.
 * Also provides a way for Entity to automatically execute
 * all of the base constructor's "Trait Constructors".
 * @param derivedCtor
 * @param baseCtors
 *
 * @category Trait
 */
export const applyTraitsMixins =
  (baseCtors: any[]) =>
  (derivedCtor: AnyClass): void => {
    // logs.debug("$ applyTraitsMixins", derivedCtor.name)

    const derived: ClassWithIED = derivedCtor.prototype

    // Place for everything internal
    if (!Object.prototype.hasOwnProperty.call(derived, ENTITY_INTERNAL_KEY)) {
      Object.defineProperty(derived, ENTITY_INTERNAL_KEY, {
        value: {
          traitsConstructors: [],
          hooks: new Map(),
          localPropDescriptor: {},
        } as InternalEntityData,
      })
    }

    const internal = derived[ENTITY_INTERNAL_KEY]

    // For each Trait
    baseCtors.forEach((baseCtor) => {
      const traitPropertyNames = Object.getOwnPropertyNames(
        baseCtor.prototype,
      ).filter((v) => v !== "constructor")

      traitPropertyNames.forEach((name) => {
        internal.localPropDescriptor[name] = Object.getOwnPropertyDescriptor(
          baseCtor.prototype,
          name,
        )
      })

      Object.getOwnPropertyNames(baseCtor).forEach((name) => {
        if (name === "typeDef") {
          for (const field in baseCtor.typeDef) {
            type(baseCtor.typeDef[field])(derived, field)
          }
        } else if (name === "trait") {
          internal.traitsConstructors.push(baseCtor.trait)
        } else if (name === "hooks" && typeof baseCtor.hooks === "object") {
          Object.keys(baseCtor.hooks).forEach((hookKey) => {
            if (!internal.hooks.has(hookKey)) {
              internal.hooks.set(hookKey, [])
            }
            internal.hooks.get(hookKey).push(baseCtor.hooks[hookKey])
          })
        }
      })
    })
  }
