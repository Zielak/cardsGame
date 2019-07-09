import { IParent } from "./parent"
import { IEntityOptions, IEntity } from "./entity"
import { def } from "@cardsgame/utils"
import { EntityTransform } from "../transform"

export interface IFlexyContainer extends IParent {
  alignItems: "start" | "end" | "center"
  directionReverse: boolean
  justifyContent:
    | "start"
    | "end"
    | "center"
    | "spaceBetween"
    | "spaceAround"
    | "spaceEvenly"
}

export interface IFlexyContainerOptions extends IEntityOptions {
  alignItems?: "start" | "end" | "center"
  directionReverse?: boolean
  justifyContent?:
    | "start"
    | "end"
    | "center"
    | "spaceBetween"
    | "spaceAround"
    | "spaceEvenly"
}

export function FlexyContainerConstructor(
  entity: IFlexyContainer,
  options: IFlexyContainerOptions
) {
  entity.alignItems = def(options.alignItems, "center")
  entity.directionReverse = def(options.directionReverse, false)
  entity.justifyContent = def(options.justifyContent, "start")
}

export function flexyContainerRestyleChild(
  child: IEntity,
  idx: number,
  children: IEntity[]
): EntityTransform {
  // TODO: finish me when needed
  let spaceOuter = 0
  let spaceBetween = 0
  return new EntityTransform(idx, -idx, 0)
}
