import { LocationTraitTypeDef } from "@cardsgame/entity-traits"
import { def } from "@cardsgame/utils"

import type { State } from "../state"

export class LocationTrait {
  /**
   * @memberof LocationTrait
   */
  x: number
  /**
   * @memberof LocationTrait
   */
  y: number
  /**
   * @memberof LocationTrait
   */
  angle: number
}

LocationTrait["typeDef"] = LocationTraitTypeDef
LocationTrait["trait"] = function constructLocationTrait(
  state: State,
  options: Partial<LocationTrait>
): void {
  this.x = def(options.x, this.x, 0)
  this.y = def(options.y, this.y, 0)
  this.angle = def(options.angle, this.angle, 0)
}
