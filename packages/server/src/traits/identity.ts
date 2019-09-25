import { type } from "@colyseus/schema"
import { State } from "../state"

export class IdentityTrait {
  name: string = "Unnamed"

  @type("string")
  type: string = "entity" // SYNCH
}

IdentityTrait.constructor = (
  entity: IdentityTrait,
  state: State,
  options: Partial<IdentityTrait> = {}
) => {
  if (options.name) {
    entity.name = options.name
  }
  if (options.type) {
    entity.type = options.type
  }
}

export function hasIdentity(entity): entity is IdentityTrait {
  return (
    typeof entity.id !== "undefined" &&
    typeof entity.name === "string" &&
    typeof entity.type === "string"
  )
}
