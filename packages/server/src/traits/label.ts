import { LabelTraitTypeDef } from "@cardsgame/entity-traits"
import { def } from "@cardsgame/utils"

import type { State } from "@/state/state.js"

/**
 * Adds `name` and `type` properties, useful for querying on server-side and for choosing client-side component.
 *
 * > TODO: I might move `type` to base Entity class, seems I'm using `type` everywhere anyway
 * @category Trait
 */
export class LabelTrait {
  /**
   * @category LabelTrait
   */
  name: string
  /**
   * Type should be unique to schema object! If you're extending this schema
   * and adding new fields - set the new type string!
   * @category LabelTrait
   */
  type: string
}

LabelTrait["typeDef"] = LabelTraitTypeDef
LabelTrait["trait"] = function constructLabelTrait(
  state: State,
  options: Partial<LabelTrait> = {},
): void {
  this.name = def(options.name, this.name, "Unnamed")
  this.type = def(options.type, this.type, "entity")
}

/**
 * @category Trait
 */
export function hasLabel(entity: unknown): entity is LabelTrait {
  return (
    !!entity &&
    typeof entity["name"] === "string" &&
    typeof entity["type"] === "string"
  )
}
