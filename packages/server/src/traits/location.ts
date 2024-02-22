import { LocationTraitTypeDef } from "@cardsgame/entity-traits"
import { def } from "@cardsgame/utils"

import type { State } from "../state/state.js"

/**
 * Adds `x`, `y` and `angle` to entity,
 * describing its location and rotation,
 * relative to its parent.
 * @category Trait
 */
export class LocationTrait {
  /**
   * X offset relative to entity's parent
   * @category LocationTrait
   */
  x: number
  /**
   * Y offset relative to entity's parent
   * @category LocationTrait
   */
  y: number
  /**
   * Rotation in degrees
   * @category LocationTrait
   */
  angle: number
}

LocationTrait["typeDef"] = LocationTraitTypeDef
LocationTrait["trait"] = function constructLocationTrait(
  state: State,
  options: Partial<LocationTrait>,
): void {
  this.x = def(options.x, this.x, 0)
  this.y = def(options.y, this.y, 0)
  this.angle = def(options.angle, this.angle, 0)
}
