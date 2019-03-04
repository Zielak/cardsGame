import { ContainersTestState } from "../state"
import { ICondition, ServerPlayerEvent } from "@cardsgame/server"

export const isCardPicked: ICondition = (
  state: ContainersTestState,
  event: ServerPlayerEvent
) => {
  return state.cardPicked
}
