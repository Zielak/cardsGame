import { Conditions } from "../conditions/conditions.js"
import { ServerPlayerMessage } from "../player/serverPlayerMessage.js"
import type { State } from "../state/state.js"

export type ClientMessageInitialSubjects = Omit<
  ServerPlayerMessage,
  "entityPath" | "timestamp" | "draggedEntity"
>
// export type ClientMessageInitialSubjects = {
//   /**
//    * game-specific player command. Defaults to "EntityInteraction"
//    * @deprecate seems needless as we have ActionTemplate.messageType
//    */
//   messageType: string
//   /**
//    * Interaction-related events
//    */
//   interaction: InteractionType
//   /**
//    * event's additional data
//    */
//   data?: any
//   /**
//    * interacting `Player`
//    */
//   player: Player
//   /**
//    * entity being interacted with
//    */
//   entity: unknown
// }

export class ClientMessageConditions<S extends State> extends Conditions<
  S,
  ClientMessageInitialSubjects
> {}
