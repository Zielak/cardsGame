import { def } from "@cardsgame/utils"

import { State } from "../state/state"

export class BoxModelTrait {
  /**
   * @memberof BoxModelTrait
   */
  width: number
  /**
   * @memberof BoxModelTrait
   */
  height: number
}

BoxModelTrait["typeDef"] = { height: "number", width: "number" }
BoxModelTrait["trait"] = function constructorBoxModelTrait(
  state: State,
  options: Partial<BoxModelTrait>
): void {
  this.width = def(options.width, this.width, 0)
  this.height = def(options.height, this.height, 0)
}
