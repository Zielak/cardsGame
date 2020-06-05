import { BoxModelTrait } from "./traits/boxModel"
import { ChildTrait, isChild } from "./traits/child"
import { FlexyTrait } from "./traits/flexyContainer"
import { hasIdentity } from "./traits/identity"
import { LabelTrait } from "./traits/label"
import { LocationTrait } from "./traits/location"
import { hasOwnership, OwnershipTrait } from "./traits/ownership"
import { ParentArrayTrait } from "./traits/parentArray"
import { ParentMapTrait } from "./traits/parentMap"
import { SelectableChildrenTrait } from "./traits/selectableChildren"
import { TwoSidedTrait } from "./traits/twoSided"

type EveryTrait = BoxModelTrait &
  ChildTrait &
  ParentArrayTrait &
  ParentMapTrait &
  FlexyTrait &
  LabelTrait &
  LocationTrait &
  OwnershipTrait &
  SelectableChildrenTrait &
  TwoSidedTrait

export type EveryTraitsOptionsKeys =
  | "width"
  | "height"
  | "idx"
  | "alignItems"
  | "directionReverse"
  | "justifyContent"
  | "name"
  | "type"
  | "x"
  | "y"
  | "angle"
  | "owner"
  | "ownerID"
  | "ownersMainFocus"
  | "hijacksInteractionTarget"
  | "maxChildren"
  | "faceUp"

export type EntityOptions = Partial<Pick<EveryTrait, EveryTraitsOptionsKeys>>

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
