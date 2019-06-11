import { ContainersTestState } from "../state"
import { ServerPlayerEvent, conditions } from "@cardsgame/server"

function isCardPicked(
  state: ContainersTestState,
  event: ServerPlayerEvent
): boolean {
  return state.cardPicked
}
isCardPicked._name = "isCardPicked"

export { isCardPicked }
