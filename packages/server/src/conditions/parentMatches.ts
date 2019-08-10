import { ICondition } from "."
import { ServerPlayerEvent } from "../player"
import { EntityProps } from "../room"
import { getParentEntity } from "../traits/entity"

/**
 * Entity's parent needs to match description with `props`
 * @param props
 */
export const parentMatches = (props: EntityProps): ICondition => {
  const parentMatches: ICondition = (_, event: ServerPlayerEvent) => {
    return Object.keys(props).every(
      key => getParentEntity(event.entity)[key] === props[key]
    )
  }

  return parentMatches
}
