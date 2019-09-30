import { State } from "../state"

export class LabelTrait {
  name: string = "Unnamed"

  type: string = "entity" // SYNCH
}

;(LabelTrait as any).typeDef = { type: "string" }
;(LabelTrait as any).trait = function LabelTrait(
  state: State,
  options: Partial<LabelTrait> = {}
) {
  if (options.name) {
    this.name = options.name
  }
  if (options.type) {
    this.type = options.type
  }
}

export function hasLabel(entity): entity is LabelTrait {
  return typeof entity.name === "string" && typeof entity.type === "string"
}
