import { ActionTemplate, conditions as cnd, PlayerEvent, State } from "../../.."
import { ChangeParent, CompositeCommand } from "../../../commands"
import { logs } from "../../../logs"
import { isCardPicked } from "../conditions/isCardPicked"
import { ChangeCardPickedState } from "../commands/changeCardPickedState"

export const PickCard: ActionTemplate = {
  name: "PickCard",
  interaction: {
    type: ["classicCard", "deck", "pile"]
  },
  conditions: [cnd.NOT(isCardPicked)],
  commandFactory: (state: State, event: PlayerEvent) => {
    const targetEntity = event.target.isContainer
      ? event.target.top
      : event.target

    return new CompositeCommand([
      new ChangeParent(
        targetEntity,
        targetEntity.parentEntity,
        state.entities.findByName("middle")
      ),
      new ChangeCardPickedState(true)
    ])
  }
}
