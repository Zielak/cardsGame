import { def } from "@cardsgame/utils"

import { State } from "../state"

export class BoxModelTrait {
  width: number
  height: number
}

;(BoxModelTrait as any).typeDef = { height: "number", width: "number" }
;(BoxModelTrait as any).trait = function BoxModelTrait(
  state: State,
  options: Partial<BoxModelTrait>
) {
  this.width = def(options.width, this.width, 0)
  this.height = def(options.height, this.height, 0)
}
