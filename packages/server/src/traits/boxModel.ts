import { def } from "@cardsgame/utils"

import { State } from "../state"

export class BoxModelTrait {
  width: number
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
