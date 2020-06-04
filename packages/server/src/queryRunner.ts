import {
  ClassicCard,
  Container,
  Deck,
  Grid,
  Hand,
  Line,
  Pile,
  Spread,
} from "./entities"
import { isChild } from "./traits/child"
import { hasIdentity } from "./traits/identity"
import { hasOwnership } from "./traits/ownership"

type EveryEntity = ClassicCard &
  Container &
  Deck &
  Grid &
  Hand &
  Line &
  Pile &
  Spread

type KeysToIgnore =
  | "$changed"
  | "childrenPointers"
  | "hijacksInteractionTarget"
  | "id"
  | "idxPath"
  | "parent"
  | "selectedChildren"

export type EntityOptions<E = {}> = Partial<
  Omit<NonFunctionProperties<EveryEntity & E>, KeysToIgnore>
>

export interface QuerableProps extends EntityOptions {
  parent?: QuerableProps
}

export const queryRunner = <T>(props: QuerableProps) => (
  entity: T
): boolean => {
  if (!isChild(entity)) return false

  const propKeys = Object.keys(props)

  return propKeys.every((propName) => {
    if (propName === "parent") {
      // Must have an identity AND be a child
      if (!hasIdentity(entity.parent)) return false
      if (!isChild(entity.parent)) return false
      // It's in root state...
      if (entity.parent.id === -1) return false

      return queryRunner(props.parent)(entity.parent)
    } else if (propName === "owner") {
      if (!hasOwnership(entity)) return false

      return entity.owner === props.owner
    } else {
      return entity[propName] === props[propName]
    }
  })
}
