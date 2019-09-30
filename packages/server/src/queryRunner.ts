import {
  BoxModelTrait,
  ChildTrait,
  ParentTrait,
  FlexyTrait,
  LabelTrait,
  LocationTrait,
  OwnershipTrait,
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

export interface QuerableProps extends Partial<Omit<EveryTrait, "parent">> {
  parent?: EntityID | QuerableProps
}

export const queryRunner = (props: QuerableProps) => entity => {
  const propKeys = Object.keys(props)

  return propKeys.every(propName => {
    return entity[propName] === props[propName]
  })
}
