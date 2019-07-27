import { IParent } from "./parent"
import { IEntityOptions } from "./entity"
import { def } from "@cardsgame/utils"
import { IBoxModel } from "./boxModel"

export interface IFlexyContainer extends IParent, IBoxModel {
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
