import { State } from "../state"

export class IdentityTrait {
  protected _id: EntityID

  get id() {
    return this._id
  }
}

;(IdentityTrait as any).trait = function IdentityTrait(state: State) {
  if (this._id !== undefined) return

  if (state) {
    this._id = state.registerEntity(this)
  } else {
    this._id = -1
  }
}
