import { ICondition, IConditionFactory } from "../condition"
import { ServerPlayerEvent } from "../player"
import { EntityProps } from "../room"

export const parentIs = (props: EntityProps): ICondition => {
  const cond: ICondition = (_, event: ServerPlayerEvent) => {
    return Object.keys(props).every(
      key => event.entity.parentEntity[key] === props[key]
    )
  }
  cond._name = "parentIs"
  return cond
}
