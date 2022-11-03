import type { Player } from "../player/index.js"
import type { QuerableProps } from "../queries/types.js"
import type { State } from "../state/state.js"

import type { BaseActionTemplate } from "./baseTemplate.js"

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
