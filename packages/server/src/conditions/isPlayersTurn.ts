import { State } from "../state"
import { ICondition } from "."
import { ServerPlayerEvent } from "../player"
import { logs } from "@cardsgame/utils"

/**
 * Checks state to confirm that it's interacting player's turn now.
 * @param state
 * @param event
 */
const isPlayersTurn: ICondition = (
  state: State,
  event: ServerPlayerEvent
): boolean => {
  if (state.currentPlayer.clientID === event.player.clientID) {
    return true
  }
  logs.warn(
    "isPlayersTurn",
    `It's not players "${event.player.clientID}" turn. State says: "${state.players[state.currentPlayerIdx].clientID}" [${state.currentPlayerIdx}]`
  )
  return false
}

export { isPlayersTurn }
