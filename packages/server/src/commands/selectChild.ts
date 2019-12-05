import { Command } from "../command"
import { State } from "../state"
import { Room } from "../room"
import { SelectableChildrenTrait } from "../traits"

export class Select extends Command {
  constructor(private parent: SelectableChildrenTrait, private idx: number) {
    super()
  }

  async execute(state: State, room: Room<any>) {
    this.parent.selectChildAt(this.idx)
  }
  async undo(state: State, room: Room<any>) {
    this.parent.deselectChildAt(this.idx)
  }
}

export class Deselect extends Command {
  constructor(private parent: SelectableChildrenTrait, private idx: number) {
    super()
  }

  async execute(state: State, room: Room<any>) {
    this.parent.deselectChildAt(this.idx)
  }
  async undo(state: State, room: Room<any>) {
    this.parent.selectChildAt(this.idx)
  }
}

export class ToggleSelection extends Command {
  private wasSelected: boolean
  constructor(private parent: SelectableChildrenTrait, private idx: number) {
    super()
  }

  async execute(state: State, room: Room<any>) {
    this.wasSelected = this.parent.selectedChildren[this.idx]
    this.parent[this.wasSelected ? "deselectChildAt" : "selectChildAt"](
      this.idx
    )
  }
  async undo(state: State, room: Room<any>) {
    this.parent[this.wasSelected ? "selectChildAt" : "deselectChildAt"](
      this.idx
    )
  }
}
