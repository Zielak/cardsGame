import type { Command } from "../command.js"
import type { ClientMessageConditions } from "../interaction/conditions.js"
import type { State } from "../state/state.js"

import { ClientMessageContext } from "./types.js"

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
    messageContext: ClientMessageContext<S>
  ) => void

  /**
   * Generate a `Command` to run for this action.
   * Use `Sequence()` if you need to run multiple commands.
   */
  command: (messageContext: ClientMessageContext<S>) => Command
}

/**
 * @ignore
 */
export interface BaseActionDefinition<S extends State> {
  name: string

  /**
   * Should run checks against interaction in interactionAction etc
   */
  checkPrerequisites(
    // message: ServerPlayerMessage, // less is more?
    messageContext: ClientMessageContext<S>
  ): boolean

  checkConditions(
    con: ClientMessageConditions<S>,
    messageContext: ClientMessageContext<S>
  ): void

  getCommand: (messageContext: ClientMessageContext<S>) => Command<S>
}

/**
 * @ignore
 */
export function extendsBaseActionDefinition<S extends State>(
  o: unknown
): o is BaseActionDefinition<S> {
  return (
    typeof o === "object" &&
    ["setupContext", "teardownContext", "hasSuccessfulSubActions"].every(
      (m) => !(m in o)
    )
  )
}
