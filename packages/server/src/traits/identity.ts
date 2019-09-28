import { State } from "../state"

export class IdentityTrait {
  id: EntityID

  constructor(state: State) {
    if (this.id !== undefined) return

    if (state) {
      this.id = state.registerEntity(this)
    } else {
      this.id = -1
    }
  }
}
