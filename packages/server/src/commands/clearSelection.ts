import { Player } from "../player"
import { State } from "../state"
import { logs } from "../logs"
import { Entity } from "../entity"
import { ICommand } from "../command"

export class ClearSelection implements ICommand {
  deselected: Entity[]
  constructor(private player: Player) {}
  execute(state: State) {
    const _ = this.constructor.name
    logs.log(_, "executing")

    this.deselected = this.player.clearSelection()
  }
  undo() {
    for (let entity of this.deselected) {
      this.player.selectEntity(entity)
    }
  }
}
