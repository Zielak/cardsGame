import { State } from "../state/state"
import { registerEntity } from "../state/helpers"

export class IdentityTrait {
  protected _id: EntityID

  get id(): number {
    return this._id
  }
}

IdentityTrait["trait"] = function constructorIdentityTrait(state: State): void {
  if (this._id !== undefined) return

  if (state) {
    this._id = registerEntity(state, this)
  } else {
    this._id = -1
  }
}

export function hasIdentity(entity): entity is IdentityTrait {
  return !!entity && typeof entity.id === "number"
}
