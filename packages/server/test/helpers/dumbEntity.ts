import { canBeChild } from "../../src/traits/parent"
import { Entity, applyMixins } from "../../src/traits"
import { ChildTrait } from "../../src/traits/child"

@canBeChild
export class DumbEntity extends Entity {}
export interface DumbEntity extends ChildTrait {}
applyMixins(DumbEntity, [ChildTrait])
