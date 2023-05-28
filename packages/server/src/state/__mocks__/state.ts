import type { Player } from "../../player/player.js"

export class State<
  V extends Record<string, unknown> = Record<string, unknown>
> {
  name = "Unnamed"
  type = "state"
  tableWidth = 60 // 60 cm
  tableHeight = 60 // 60 cm
  clients = new Array<string>()
  turnBased = true
  round = 0
  players = new Array<Player>()
  currentPlayerIdx = 0

  get currentPlayer(): Player {
    return this.turnBased ? this.players[this.currentPlayerIdx] : null
  }
  isGameStarted = false
  isGameOver = false

  ui = {}

  playerViewPosition = {
    alignX: "center",
    alignY: "bottom",
    paddingX: 0,
    paddingY: 0,
  }

  variantData: V
  hijacksInteractionTarget = false

  id = 0

  _registerEntity(): void {
    // do nothing
  }
}
