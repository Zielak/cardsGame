import {
  BoxModelTrait,
  ChildTrait,
  FlexyTrait,
  hasIdentity,
  isChild,
  LabelTrait,
  LocationTrait,
  OwnershipTrait,
  ParentTrait,
  SelectableChildrenTrait,
  TwoSidedTrait
} from "./traits"

type EveryTrait = BoxModelTrait &
  ChildTrait &
  ParentTrait &
  FlexyTrait &
  LabelTrait &
  LocationTrait &
  OwnershipTrait &
  SelectableChildrenTrait &
  TwoSidedTrait

export interface QuerableProps
  extends Partial<
    Pick<
      EveryTrait,
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
      | "isInOwnersView"
      | "hijacksInteractionTarget"
      | "faceUp"
    >
  > {
  parent?: QuerableProps
}

export const queryRunner = <T>(props: QuerableProps) => (entity: T) => {
  if (!isChild(entity)) return false

  const propKeys = Object.keys(props)

  return propKeys.every(propName => {
    if (propName === "parent") {
      // Must have an identity AND be a child
      if (!hasIdentity(entity.parent)) return false
      if (!isChild(entity.parent)) return false
      // It's in root state...
      if (entity.parent.id === -1) return false

      return queryRunner(props.parent)(entity.parent)
    } else {
      return entity[propName] === props[propName]
    }
  })
}
