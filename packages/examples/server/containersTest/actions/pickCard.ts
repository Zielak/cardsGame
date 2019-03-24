import {
  ActionTemplate,
  conditions as con,
  commands as cmd,
  ServerPlayerEvent,
  State,
  logs
} from "@cardsgame/server"

import { isCardPicked } from "../conditions/isCardPicked"
import { ChangeCardPickedState } from "../commands/changeCardPickedState"

export const PickCard: ActionTemplate = {
  name: "PickCard",
  getInteractions: () => [
    {
      type: ["classicCard", "deck", "pile"]
    }
  ],
  getConditions: () => [con.NOT(isCardPicked)],
  getCommands: (state: State, event: ServerPlayerEvent) => {
    const targetEntity = event.entity.isContainer
      ? event.entity.top
      : event.entity

    return new cmd.CompositeCommand([
      new cmd.ChangeParent(
        targetEntity,
        targetEntity.parentEntity,
        state.entities.findByName("middle")
      ),
      new ChangeCardPickedState(true)
    ])
  }
}
