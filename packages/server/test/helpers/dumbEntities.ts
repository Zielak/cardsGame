import { canBeChild, containsChildren } from "../../src/annotations"

import { ChildTrait } from "../../src/traits/child"
import { Entity, applyMixins } from "../../src/traits/entity"
import { IdentityTrait } from "../../src/traits/identity"
import { ParentArrayTrait } from "../../src/traits/parentArray"
import { ParentMapTrait } from "../../src/traits/parentMap"

@canBeChild
@containsChildren()
@applyMixins([IdentityTrait, ParentArrayTrait, ChildTrait])
export class DumbArrayParent extends Entity<DumbArrayParent> {}
export interface DumbArrayParent
  extends IdentityTrait,
    ParentArrayTrait,
    ChildTrait {}

@canBeChild
@containsChildren()
@applyMixins([IdentityTrait, ParentMapTrait, ChildTrait])
export class DumbMapParent extends Entity<DumbMapParent> {}
export interface DumbMapParent
  extends IdentityTrait,
    ParentMapTrait,
    ChildTrait {}

@canBeChild
@applyMixins([IdentityTrait, ChildTrait])
export class DumbEntity extends Entity<DumbEntity> {}
export interface DumbEntity extends IdentityTrait, ChildTrait {}
