import {
  ActionTemplate,
  ServerPlayerEvent,
  State,
  commands as cmd,
  find,
  getTop,
  IParent,
  IEntity,
  getParentEntity
} from "@cardsgame/server"

import { isCardPicked } from "../conditions/isCardPicked"
import { ChangeCardPickedState } from "../commands/changeCardPickedState"

export const MoveCards: ActionTemplate = {
  name: "MoveCard",
  getCommands: (state: State, event: ServerPlayerEvent) => {
    // Get container from targets
    const targetContainer = event.entity.isParent()
      ? event.entity
      : getParentEntity(event.entity)
    const entity = getTop<IEntity>(find<IParent>(state, { name: "middle" }))

    return new cmd.CompositeCommand([
      new cmd.ChangeParent(entity, getParentEntity(entity), targetContainer),
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
