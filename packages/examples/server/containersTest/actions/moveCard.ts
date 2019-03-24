import {
  ActionTemplate,
  ServerPlayerEvent,
  State,
  commands as cmd,
  logs
} from "@cardsgame/server"

import { isCardPicked } from "../conditions/isCardPicked"
import { ChangeCardPickedState } from "../commands/changeCardPickedState"

export const MoveCards: ActionTemplate = {
  name: "MoveCard",
  getCommands: (state: State, event: ServerPlayerEvent) => {
    // Get container from targets
    const targetContainer = event.entities.find(el => el.isContainer)
    const entity = state.entities.findByName("middle").top

    return new cmd.CompositeCommand([
      new cmd.ChangeParent(entity, entity.parentEntity, targetContainer),
      new ChangeCardPickedState(false)
    ])
  },
  getInteractions: () => [
    {
      type: ["deck", "pile", "hand"]
    }
  ],
  getConditions: () => [isCardPicked]
}
