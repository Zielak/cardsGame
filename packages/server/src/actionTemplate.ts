import type { Command } from "./command"
import type { ClientMessageConditions } from "./interaction"
import type { Player, ServerPlayerMessage } from "./player"
import type { QuerableProps } from "./queryRunner"
import type { State } from "./state"

interface BaseActionTemplate<S extends State> {
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

export interface ActionTemplate<S extends State> extends BaseActionTemplate<S> {
  /**
   * Function returning queries for interacted entities.
   */
  interaction?: (player: Player) => QuerableProps[]

  /**
   * How do you expect entities to be interacted with.
   */
  interactionType?: InteractionType

  /**
   * Custom game message type,
   * or "EntityInteraction" in case of entity interaction
   */
  messageType?: string
}

export type ActionsSet<S extends State> = Set<ActionTemplate<S>>

interface EntitiesActionTemplate<S extends State>
  extends BaseActionTemplate<S> {
  interaction: Required<ActionTemplate<S>["interaction"]>
  interactionType: ActionTemplate<S>["interactionType"]
  messageType: "EntityInteraction"
}

interface EventActionTemplate<S extends State> extends BaseActionTemplate<S> {
  messageType: ActionTemplate<S>["messageType"]
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
  const doesNotHaveInteraction = typeof o === "object" && !("interaction" in o)
  const hasNonInteractionMessage =
    typeof o === "object" &&
    "messageType" in o &&
    typeof o["messageType"] === "string" &&
    o["messageType"] !== "EntityInteraction"

  return doesNotHaveInteraction && hasNonInteractionMessage
}
