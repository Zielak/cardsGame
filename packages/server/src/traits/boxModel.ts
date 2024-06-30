import { BoxModelTypeDef } from "@cardsgame/entity-traits"
import { def } from "@cardsgame/utils"

import type { State } from "@/state/state.js"

/**
 * Currently unused
 * @category Trait
 */
export class BoxModelTrait {
  /**
   * @category BoxModelTrait
   */
  width: number
  /**
   * @category BoxModelTrait
   */
  height: number
}

BoxModelTrait["typeDef"] = BoxModelTypeDef
BoxModelTrait["trait"] = function constructBoxModelTrait(
  state: State,
  options: Partial<BoxModelTrait>,
): void {
  this.width = def(options.width, this.width, 0)
  this.height = def(options.height, this.height, 0)
}
