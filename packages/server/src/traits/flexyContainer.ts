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

;(FlexyTrait as any).trait = function FlexyTrait(
  state: State,
  options: Partial<FlexyTrait> = {}
) {
  this.alignItems = def(options.alignItems, "center")
  this.directionReverse = def(options.directionReverse, false)
  this.justifyContent = def(options.justifyContent, "start")
}
