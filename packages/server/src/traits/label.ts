import { State } from "../state"

export class LabelTrait {
  name: string = "Unnamed"

  type: string = "entity" // SYNCH

  constructor(state: State, options: Partial<LabelTrait> = {}) {
    if (options.name) {
      this.name = options.name
    }
    if (options.type) {
      this.type = options.type
    }
  }
}

;(LabelTrait as any).typeDef = { type: "string" }

export function hasIdentity(entity): entity is LabelTrait {
  return (
    typeof entity.id !== "undefined" &&
    typeof entity.name === "string" &&
    typeof entity.type === "string"
  )
}
