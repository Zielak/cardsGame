import { def } from "@cardsgame/utils"
import { State } from "../state"

export class FlexyTrait {
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

FlexyTrait.constructor = (
  entity: FlexyTrait,
  state: State,
  options: Partial<FlexyTrait> = {}
) => {
  entity.alignItems = def(options.alignItems, "center")
  entity.directionReverse = def(options.directionReverse, false)
  entity.justifyContent = def(options.justifyContent, "start")
}
