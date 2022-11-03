import type { Command } from "../command.js"
import type { ClientMessageConditions } from "../interaction/conditions.js"
import type { ServerPlayerMessage } from "../player/serverPlayerMessage.js"
import type { State } from "../state/state.js"

/**
 * @ignore
 */
export interface BaseActionTemplate<S extends State> {
  name: string
  description?: string

  /**
   * This action will be ignored when one of the assertions fail.
   *
   * @param {ClientMessageConditions<S>} con contains references to "command",
   * "event", "data", "player" and "entity". Default subject is set to the game state.
   */
  conditions: (con: ClientMessageConditions<S>) => void

  /**
   * Generate a `Command` to run for this action.
   * Use `Sequence()` if you need to run multiple commands.
   */
  command: (state: S, event: ServerPlayerMessage) => Command
}
