import { def } from "@cardsgame/utils"

import { State } from "../state/state"

export class LabelTrait {
  /**
   * @memberof LabelTrait
   */
  name: string
  /**
   * @memberof LabelTrait
   */
  type: string
}

LabelTrait["typeDef"] = {
  type: "string",
  name: "string",
}
LabelTrait["trait"] = function constructorLabelTrait(
  state: State,
  options: Partial<LabelTrait> = {}
): void {
  this.name = def(options.name, this.name, "Unnamed")
  this.type = def(options.type, this.type, "entity")
}

export function hasLabel(entity: unknown): entity is LabelTrait {
  return (
    !!entity &&
    typeof entity.name === "string" &&
    typeof entity.type === "string"
  )
}
