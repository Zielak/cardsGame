import { ContainersTestState } from "../state"
import { ServerPlayerEvent, conditions } from "@cardsgame/server"

export const isCardPicked: conditions.ICondition = (
  state: ContainersTestState,
  event: ServerPlayerEvent
) => {
  return state.cardPicked
}
isCardPicked._name = "isCardPicked"
