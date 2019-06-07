import {
  ActionTemplate,
  conditions as con,
  commands as cmd,
  ServerPlayerEvent,
  State,
  getTop,
  IEntity,
  getParentEntity,
  find
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
    const targetEntity = event.entity.isParent()
      ? getTop<IEntity>(event.entity)
      : event.entity

    return new cmd.CompositeCommand([
      new cmd.ChangeParent(
        targetEntity,
        getParentEntity(targetEntity),
        find(state, { name: "middle" })
      ),
      new ChangeCardPickedState(true)
    ])
  }
}
