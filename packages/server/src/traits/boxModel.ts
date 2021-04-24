import { BoxModelTypeDef } from "@cardsgame/entity-traits"
import { def } from "@cardsgame/utils"

import type { State } from "../state/state"

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

BoxModelTrait["typeDef"] = BoxModelTypeDef
BoxModelTrait["trait"] = function constructBoxModelTrait(
  state: State,
  options: Partial<BoxModelTrait>
): void {
  this.width = def(options.width, this.width, 0)
  this.height = def(options.height, this.height, 0)
}
