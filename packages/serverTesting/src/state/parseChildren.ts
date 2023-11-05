import type { State } from "@cardsgame/server"
import { traits } from "@cardsgame/server"

import { decipherName } from "../decipherName.js"
import { defaultEntities } from "../entities.js"
import type { EntityConstructor, EntityMockingDefinition } from "../types.js"

import { copyPrimitives } from "./copyPrimitives.js"

/**
 * Following `preparation` recursively, creates every child entity everywhere.
 *
 * @param state the root state reference
 * @param entity current entity putting new children into
 * @param preparation user provided definition of entity/ies
 * @param gameEntities additional custom entities to grab constructors from
 */
export function parseChildren(
  state: State,
  entity: traits.ParentTrait,
  preparation: EntityMockingDefinition,
  gameEntities?: Record<string, EntityConstructor>,
): void {
  // Prepare children
  const newChildren = preparation.children?.map((childDef) => {
    const type = childDef.type ?? "classicCard"
    const entityConstructor = gameEntities?.[type] || defaultEntities[type]

    const options: Record<string, any> = {}
    if ("name" in childDef) {
      decipherName(childDef, options)
    }
    options.parent = entity

    const child = new entityConstructor(state, options)
    entity.addChild(child)

    copyPrimitives(child, childDef)

    if (traits.isParent(child)) {
      parseChildren(state, child, childDef, gameEntities)
    }

    return child
  })
  // Selection, if used
  if (
    preparation.selected &&
    traits.isParent(entity) &&
    traits.hasSelectableChildren(entity)
  ) {
    preparation.selected.forEach((childDefIdx) => {
      if (preparation.selected?.includes(childDefIdx)) {
        entity.selectChildAt(newChildren[childDefIdx].idx)
      }
    })
  }
}
