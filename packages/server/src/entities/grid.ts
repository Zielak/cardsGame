import { def, limit } from "@cardsgame/utils"

import { canBeChild, containsChildren } from "../annotations"
import { State } from "../state"

import { ChildTrait } from "../traits/child"
import { Entity, applyMixins } from "../traits/entity"
import { IdentityTrait } from "../traits/identity"
import { LabelTrait } from "../traits/label"
import { LocationTrait } from "../traits/location"
import { OwnershipTrait } from "../traits/ownership"
import { ParentMapTrait } from "../traits/parentMap"
import { SelectableChildrenTrait } from "../traits/selectableChildren"

/**
 * Two dimensional container of items of set spots.
 * May also be used as one-dimensional "line" of limited child items.
 */
@canBeChild
@containsChildren()
@applyMixins([
  IdentityTrait,
  LocationTrait,
  ChildTrait,
  ParentMapTrait,
  LabelTrait,
  OwnershipTrait,
  SelectableChildrenTrait
])
export class Grid extends Entity<GridOptions> {
  columns: number
  rows: number

  cellSpacing: number

  itemAngle: number
  itemSpacingX: number
  itemSpacingY: number

  create(state: State, options: GridOptions = {}) {
    this.name = def(options.name, "Grid")
    this.type = def(options.type, "grid")

    this.columns = def(limit(options.columns, 1), 1)
    this.rows = def(limit(options.rows, 1), 1)

    this.cellSpacing = def(options.cellSpacing, 0)

    this.itemAngle = def(options.itemAngle, 0)
    this.itemSpacingX = def(options.itemSpacingX, 0)
    this.itemSpacingY = def(options.itemSpacingY, 0)
  }
}

interface Mixin
  extends IdentityTrait,
    LocationTrait,
    ChildTrait,
    ParentMapTrait,
    LabelTrait,
    OwnershipTrait,
    SelectableChildrenTrait {}

type GridOptions = Partial<
  ConstructorType<Mixin> & {
    columns: number
    rows: number
    cellSpacing: number

    itemAngle: number
    itemSpacingX: number
    itemSpacingY: number
  }
>

export interface Grid extends Mixin {}