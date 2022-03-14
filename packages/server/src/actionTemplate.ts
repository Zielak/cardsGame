import type { Command } from "./command"
import type { ClientMessageConditions } from "./interaction"
import type { Player, ServerPlayerMessage } from "./players/player"
import type { QuerableProps } from "./queryRunner"
import type { State } from "./state"

export interface ActionTemplate<S extends State> {
  name: string
  description?: string

  /**
   * Either a function returning queries for associated entities
   * OR a string for event type.
   */
  interaction: string | ((player: Player) => QuerableProps[])

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

export type ActionsSet<S extends State> = Set<ActionTemplate<S>>

/**
 * @ignore
 */
export interface EntitiesActionTemplate<S extends State>
  extends ActionTemplate<S> {
  /**
   * Function returning queries for associated entities.
   */
  interaction: (player: Player) => QuerableProps[]
}
/**
 * @ignore
 */
export interface EventActionTemplate<S extends State>
  extends ActionTemplate<S> {
  /**
   * A string for event type.
   */
  interaction: string
}

export function isInteractionOfEntities<S extends State = any>(
  o: unknown
): o is EntitiesActionTemplate<S> {
  return (
    typeof o === "object" &&
    "interaction" in o &&
    typeof o["interaction"] === "function"
  )
}

export function isInteractionOfEvent<S extends State = any>(
  o: unknown
): o is EventActionTemplate<S> {
  return (
    typeof o === "object" &&
    "interaction" in o &&
    typeof o["interaction"] === "string"
  )
}
