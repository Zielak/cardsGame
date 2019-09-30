import { State } from "../state"

export class IdentityTrait {
  private _id: EntityID

  get id() {
    return this._id
  }

  constructor(state: State) {
    if (this._id !== undefined) return

    if (state) {
      this._id = state.registerEntity(this)
    } else {
      this._id = -1
    }
  }
}
