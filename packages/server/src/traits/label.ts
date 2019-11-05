import { State } from "../state"
import { def } from "@cardsgame/utils"

export class LabelTrait {
  name: string
  type: string
}

;(LabelTrait as any).typeDef = { type: "string" }
;(LabelTrait as any).trait = function LabelTrait(
  state: State,
  options: Partial<LabelTrait> = {}
) {
  this.name = def(options.name, this.name, "Unnamed")
  this.type = def(options.type, this.type, "entity")
}

export function hasLabel(entity): entity is LabelTrait {
  return (
    !!entity &&
    typeof entity.name === "string" &&
    typeof entity.type === "string"
  )
}
