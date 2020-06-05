import { canBeChild } from "../../src/annotations/canBeChild"
import { containsChildren } from "../../src/annotations/containsChildren"
import { ChildTrait } from "../../src/traits/child"
import { applyTraitsMixins, Entity } from "../../src/traits/entity"
import { IdentityTrait } from "../../src/traits/identity"
import { ParentArrayTrait } from "../../src/traits/parentArray"
import { ParentMapTrait } from "../../src/traits/parentMap"

@canBeChild
@containsChildren()
@applyTraitsMixins([IdentityTrait, ParentArrayTrait, ChildTrait])
export class DumbArrayParent extends Entity<DumbArrayParent> {}
export interface DumbArrayParent
  extends IdentityTrait,
    ParentArrayTrait,
    ChildTrait {}

@canBeChild
@containsChildren()
@applyTraitsMixins([IdentityTrait, ParentMapTrait, ChildTrait])
export class DumbMapParent extends Entity<DumbMapParent> {}
export interface DumbMapParent
  extends IdentityTrait,
    ParentMapTrait,
    ChildTrait {}

@canBeChild
@applyTraitsMixins([IdentityTrait, ChildTrait])
export class DumbEntity extends Entity<DumbEntity> {}
export interface DumbEntity extends IdentityTrait, ChildTrait {}
