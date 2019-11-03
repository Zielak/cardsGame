import { State } from "../state"
import { def } from "@cardsgame/utils"

export class LocationTrait {
  x: number
  y: number
  angle: number
}

;(LocationTrait as any).typeDef = {
  x: "number",
  y: "number",
  angle: "number"
}
;(LocationTrait as any).trait = function LocationTrait(
  state: State,
  options: Partial<LocationTrait>
) {
  this.x = def(options.x, this.x, 0)
  this.y = def(options.y, this.y, 0)
  this.angle = def(options.angle, this.angle, 0)
}
