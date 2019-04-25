import { ICondition } from "../condition"
import { ServerPlayerEvent } from "../player"
import { EntityProps } from "../room"
import { getParentEntity } from "../entities/entity"

export const parentIs = (props: EntityProps): ICondition => {
  const cond: ICondition = (_, event: ServerPlayerEvent) => {
    return Object.keys(props).every(
      key => getParentEntity(event.entity)[key] === props[key]
    )
  }
  cond._name = "parentIs"
  return cond
}
