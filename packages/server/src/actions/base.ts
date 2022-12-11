import type { Command } from "../command.js"
import type {
  ClientMessageConditions,
  ClientMessageInitialSubjects,
} from "../interaction/conditions.js"
import type { ServerPlayerMessage } from "../player/serverPlayerMessage.js"
import type { State } from "../state/state.js"

/**
 * Template used by game dev.
 */
export interface BaseActionTemplate<S extends State> {
  name: string

  /**
   * This action will be ignored when one of the assertions fail.
   *
   * @param con conditions runner. Default subject is set to the game state.
   * @param initialSubjects Direct references to subjects brought with player's event
   */
  conditions: (
    con: ClientMessageConditions<S>,
    initialSubjects: ClientMessageInitialSubjects
  ) => void

  /**
   * Generate a `Command` to run for this action.
   * Use `Sequence()` if you need to run multiple commands.
   */
  command: (state: S, event: ServerPlayerMessage) => Command
}

export interface BaseActionDefinition<S extends State> {
  name: string

  /**
   * Should run checks against interaction in interactionAction etc
   */
  checkPrerequisites(message: ServerPlayerMessage): boolean

  checkConditions(
    con: ClientMessageConditions<S>,
    initialSubjects: ClientMessageInitialSubjects
  ): void

  getCommand: (state: S, event: ServerPlayerMessage) => Command<S>
}
