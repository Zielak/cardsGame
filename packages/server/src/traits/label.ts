import { def } from "@cardsgame/utils"

import { State } from "../state/state"

export class LabelTrait {
  /**
   * @memberof LabelTrait
   */
  name: string
  /**
   * Type should be unique to schema object! If you're extending this schema
   * and adding new fields - set the new type string!
   * @memberof LabelTrait
   */
  type: string
}

LabelTrait["typeDef"] = {
  type: "string",
  name: "string",
}
LabelTrait["trait"] = function constructLabelTrait(
  state: State,
  options: Partial<LabelTrait> = {}
): void {
  this.name = def(options.name, this.name, "Unnamed")
  this.type = def(options.type, this.type, "entity")
}

export function hasLabel(entity: unknown): entity is LabelTrait {
  return (
    !!entity &&
    typeof entity["name"] === "string" &&
    typeof entity["type"] === "string"
  )
}
