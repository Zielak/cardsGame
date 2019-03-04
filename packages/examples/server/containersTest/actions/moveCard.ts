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
  commandFactory: (state: State, event: ServerPlayerEvent) => {
    // Get container from targets
    const targetContainer = event.targets.find(el => el.isContainer)
    const entity = state.entities.findByName("middle").top

    return new cmd.CompositeCommand([
      new cmd.ChangeParent(entity, entity.parentEntity, targetContainer),
      new ChangeCardPickedState(false)
    ])
  },
  interaction: {
    type: ["deck", "pile", "hand"]
  },
  conditions: [isCardPicked]
}
