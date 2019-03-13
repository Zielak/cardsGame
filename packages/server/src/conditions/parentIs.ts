import { ICondition } from "../condition"
import { ServerPlayerEvent } from "../player"
import { EntityProps } from "../room"

export const parentIs = (props: EntityProps): ICondition => (
  _,
  event: ServerPlayerEvent
) => {
  return Object.keys(props).every(
    key => event.target.parentEntity[key] === props[key]
  )
}
