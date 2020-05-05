import { def } from "@cardsgame/utils"

import { State } from "../state"

export class LocationTrait {
  x: number
  y: number
  angle: number
}

LocationTrait["typeDef"] = {
  x: "number",
  y: "number",
  angle: "number",
}
LocationTrait["trait"] = function constructorLocationTrait(
  state: State,
  options: Partial<LocationTrait>
): void {
  this.x = def(options.x, this.x, 0)
  this.y = def(options.y, this.y, 0)
  this.angle = def(options.angle, this.angle, 0)
}
