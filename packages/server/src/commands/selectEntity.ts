import { Player } from "../player"
import { State } from "../state"
import { logs } from "../logs"
import { Entity } from "../entity"
import { ICommand } from "../command"

export class SelectEntity implements ICommand {
  constructor(
    private player: Player,
    private entity: Entity,
    private selected: boolean
  ) {}
  execute(state: State) {
    const _ = this.constructor.name
    logs.log(_, "executing")

    if (this.selected) {
      this.player.selectEntity(this.entity)
    } else {
      this.player.deselectEntity(this.entity)
    }
  }
  undo() {
    if (this.selected) {
      this.player.deselectEntity(this.entity)
    } else {
      this.player.selectEntity(this.entity)
    }
  }
}
