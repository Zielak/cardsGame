import { FlexyTraitTypeDef } from "@cardsgame/entity-traits"
import { def } from "@cardsgame/utils"

import type { State } from "../state"

type JustifyContent =
  | "start"
  | "end"
  | "center"
  | "spaceBetween"
  | "spaceAround"
  | "spaceEvenly"

export class FlexyTrait {
  /**
   * @memberof FlexyTrait
   */
  alignItems: "start" | "end" | "center"
  /**
   * @memberof FlexyTrait
   */
  directionReverse: boolean
  /**
   * @memberof FlexyTrait
   */
  justifyContent: JustifyContent
}

FlexyTrait["trait"] = function constructFlexyTrait(
  state: State,
  options: Partial<FlexyTrait> = {}
): void {
  this.alignItems = def(options.alignItems, "center")
  this.directionReverse = def(options.directionReverse, false)
  this.justifyContent = def(options.justifyContent, "start")
}
FlexyTrait["typeDef"] = FlexyTraitTypeDef
