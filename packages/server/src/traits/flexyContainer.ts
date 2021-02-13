import { def } from "@cardsgame/utils"

import { State } from "../state/state"

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
  justifyContent:
    | "start"
    | "end"
    | "center"
    | "spaceBetween"
    | "spaceAround"
    | "spaceEvenly"
}

FlexyTrait["trait"] = function constructFlexyTrait(
  state: State,
  options: Partial<FlexyTrait> = {}
): void {
  this.alignItems = def(options.alignItems, "center")
  this.directionReverse = def(options.directionReverse, false)
  this.justifyContent = def(options.justifyContent, "start")
}
FlexyTrait["typeDef"] = {
  alignItems: "string",
  directionReverse: "boolean",
  justifyContent: "string",
}
