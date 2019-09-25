import { Entity, applyMixins } from "../../src/traits/entity"
import {
  containsChildren,
  canBeChild,
  ParentTrait
} from "../../src/traits/parent"

@canBeChild
@containsChildren()
export class DumbParent extends Entity {}
export interface DumbParent extends ParentTrait {}
applyMixins(DumbParent, [ParentTrait])
