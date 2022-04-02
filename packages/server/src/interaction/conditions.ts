import { Conditions } from "../conditions"
import type { Player } from "../player"
import type { State } from "../state"

export type ClientMessageInitialSubjects = {
  /**
   * Changes current `subject` to game-specific player command. Defaults to "EntityInteraction"
   */
  messageType: string
  /**
   * Changes current `subject` to Interaction-related events ("click", "touchstart"...)
   */
  event: string
  /**
   * Changes current `subject` to event's additional data
   */
  data: any
  /**
   * Changes current `subject` to interacting `Player`
   */
  player: Player
  /**
   * Changes current `subject` to entity being interacted with
   */
  entity: unknown
}

export class ClientMessageConditions<S extends State> extends Conditions<
  S,
  ClientMessageInitialSubjects
> {}
