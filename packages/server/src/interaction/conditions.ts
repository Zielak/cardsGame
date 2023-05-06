import { Conditions } from "../conditions/conditions.js"
import type { Player } from "../player/player.js"
import type { State } from "../state/state.js"

export type ClientMessageInitialSubjects = {
  /**
   * ~~Changes current `subject` to~~ game-specific player command. Defaults to "EntityInteraction"
   * @deprecate seems needless as we have ActionTemplate.messageType
   */
  messageType: string
  /**
   * ~~Changes current `subject` to~~ Interaction-related events
   */
  interaction: InteractionType
  /**
   * ~~Changes current `subject` to~~ event's additional data
   */
  data?: any
  /**
   * ~~Changes current `subject` to~~ interacting `Player`
   */
  player: Player
  /**
   * ~~Changes current `subject` to~~ entity being interacted with
   */
  entity: unknown
}

export class ClientMessageConditions<S extends State> extends Conditions<
  S,
  ClientMessageInitialSubjects
> {}
