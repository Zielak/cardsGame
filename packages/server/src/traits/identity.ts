import { State } from "../state/state"

export class IdentityTrait {
  // Value is set in State._registerEntity()
  readonly id: number
}

IdentityTrait["trait"] = function constructorIdentityTrait(state: State): void {
  // State itself can also report in here.
  state?._registerEntity(this)
}

export function hasIdentity(entity): entity is IdentityTrait {
  return !!entity && typeof entity.id === "number"
}
