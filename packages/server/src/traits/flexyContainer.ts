import { FlexyTraitTypeDef } from "@cardsgame/entity-traits"
import { def } from "@cardsgame/utils"

import type { State } from "../state/state.js"

type JustifyContent =
  | "start"
  | "end"
  | "center"
  | "spaceBetween"
  | "spaceAround"
  | "spaceEvenly"

/**
 * Defines entity as flexible in size.
 * Contains props useful to create Flex Box in web browser:
 *
 * - `alignItems`
 * - `justifyContent`
 * - `directionReverse`
 * @category Trait
 */
export class FlexyTrait {
  /**
   * @category FlexyTrait
   */
  alignItems: "start" | "end" | "center"
  /**
   * @category FlexyTrait
   */
  directionReverse: boolean
  /**
   * @category FlexyTrait
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
