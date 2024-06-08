import type { State } from "@/state/state.js"

/**
 * :::caution Required trait
 *
 * Every entity has to have it.
 * Game state keeps track of every entity in game by their ID's
 *
 * :::
 *
 * > TODO: I might just bake that trait into base Entity class...
 * @category Trait
 */
export class IdentityTrait {
  // Value is set in State._registerEntity()
  readonly id: number
}

IdentityTrait["trait"] = function constructIdentityTrait(state: State): void {
  // State itself can also report in here.
  state?._registerEntity(this)
}

/**
 * @category Trait
 */
export function hasIdentity(entity): entity is IdentityTrait {
  return !!entity && typeof entity.id === "number"
}
