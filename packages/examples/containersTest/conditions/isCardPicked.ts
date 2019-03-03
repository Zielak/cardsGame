import { ICondition } from "../../../condition"
import { PlayerEvent } from "../../.."
import { ContainersTestState } from "../state"

export const isCardPicked: ICondition = (
  state: ContainersTestState,
  event: PlayerEvent
) => {
  return state.cardPicked
}
