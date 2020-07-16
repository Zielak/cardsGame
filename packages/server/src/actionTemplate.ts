import { Command } from "./command"
import { ClientEventConditions } from "./interaction"
import { Player, ServerPlayerEvent } from "./players/player"
import { QuerableProps } from "./queryRunner"
import { State } from "./state/state"

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
   * Default `subject` is set to the game state.
   */
  conditions: (con: ClientEventConditions<S>) => void

  /**
   * Generate a `Command` to run for this action.
   * Use `Sequence()` if you need to run multiple commands.
   */
  command: (state: S, event: ServerPlayerEvent) => Command
}

export type ActionsSet<S extends State> = Set<ActionTemplate<S>>

export interface EntitiesActionTemplate<S extends State>
  extends ActionTemplate<S> {
  interaction: (player: Player) => QuerableProps[]
}
export interface EventActionTemplate<S extends State>
  extends ActionTemplate<S> {
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
