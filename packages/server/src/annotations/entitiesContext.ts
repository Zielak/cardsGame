import type { DefinitionType } from "@colyseus/schema"

import type { Entity } from "../traits/entity"

type RegisteredParent = {
  con: typeof Entity
  childrenSynced: boolean
}

export class EntitiesContext {
  allChildrensTypes: Map<string, DefinitionType>

  registeredTypeDefinitions: Map<string, Map<string, DefinitionType>>

  registeredChildren: AnyClass[]
  registeredParents: RegisteredParent[]

  constructor() {
    this.allChildrensTypes = new Map()
    this.registeredTypeDefinitions = new Map()
    this.registeredChildren = []
    this.registeredParents = []
  }
}

/**
 * Global context of entities.
 */
export const globalEntitiesContext = new EntitiesContext()
