import { ActionTemplate, PlayerEvent, State } from "../../.."

import { ChangeParent, CompositeCommand } from "../../../commands"
import { logs } from "../../../logs"
import { isCardPicked } from "../conditions/isCardPicked"
import { ChangeCardPickedState } from "../commands/changeCardPickedState"

export const MoveCards: ActionTemplate = {
  name: "MoveCard",
  commandFactory: (state: State, event: PlayerEvent) => {
    // Get container from targets
    const targetContainer = event.targets.find(el => el.isContainer)
    const entity = state.entities.findByName("middle").top

    return new CompositeCommand([
      new ChangeParent(entity, entity.parentEntity, targetContainer),
      new ChangeCardPickedState(false)
    ])
  },
  interaction: {
    type: ["deck", "pile", "hand"]
  },
  conditions: [isCardPicked]
}
