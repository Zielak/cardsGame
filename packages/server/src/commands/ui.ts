import { Command } from "../command.js"
import type { Room } from "../room.js"
import type { State } from "../state/state.js"

export class RevealUI extends Command {
  lastUiName: string
  lastUiValue: string

  constructor(private uiName: string, private clientID?: string) {
    super()
  }

  async execute(state: State, room: Room<any>): Promise<void> {
    this.lastUiName = this.uiName
    this.lastUiValue = state.ui.get(this.uiName)
    state.ui.set(this.uiName, this.clientID || state.currentPlayer.clientID)
  }

  async undo(state: State, room: Room<any>): Promise<void> {
    state.ui.set(this.lastUiName, this.lastUiValue)
  }
}

export class HideUI extends Command {
  lastUiName: string
  lastUiValue: string

  constructor(private uiName: string) {
    super()
  }

  async execute(state: State, room: Room<any>): Promise<void> {
    this.lastUiName = this.uiName
    this.lastUiValue = state.ui.get(this.uiName)
    state.ui.set(this.uiName, "")
  }

  async undo(state: State, room: Room<any>): Promise<void> {
    state.ui.set(this.lastUiName, this.lastUiValue)
  }
}
