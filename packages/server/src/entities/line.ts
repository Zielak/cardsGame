import { def } from "@cardsgame/utils"

import { canBeChild, containsChildren, type } from "../annotations"
import { State } from "../state"

import { ChildTrait } from "../traits/child"
import { Entity, applyTraitsMixins } from "../traits/entity"
import { IdentityTrait } from "../traits/identity"
import { LabelTrait } from "../traits/label"
import { LocationTrait } from "../traits/location"
import { OwnershipTrait } from "../traits/ownership"
import { ParentArrayTrait } from "../traits/parentArray"
import { SelectableChildrenTrait } from "../traits/selectableChildren"

/**
 * A container of items to be placed in linear fashion
 */
@canBeChild
@containsChildren()
@applyTraitsMixins([
  IdentityTrait,
  LocationTrait,
  ChildTrait,
  ParentArrayTrait,
  LabelTrait,
  OwnershipTrait,
  SelectableChildrenTrait,
])
export class Line extends Entity<LineOptions> {
  hijacksInteractionTarget = false

  /**
   * 0cm by default, sets the point of overflow.
   */
  @type("float32") length: number

  /**
   * Should the items overflow over the edge,
   * or squeeze in and keep in the Lines length?
   * Remember, items don't "wrap" to "the next line".
   * Default value depends on `length`:
   * - length=0 -> overflow=true
   * - length>0 -> overflow=false
   */
  @type("boolean") overflow: boolean

  /**
   * How should items align within the container.
   * In zero-length container only "start" and "end" values make sense.
   */
  @type("string") align: LineAlign

  /**
   * An angle at which items are rotated by default.
   * Line looks like a row by default. To make a column
   */
  @type("float32") itemAngle: number

  /**
   * Margin or overlapping (negative values) between items
   */
  @type("float32") itemSpacing: number

  create(state: State, options: LineOptions = {}) {
    this.name = def(options.name, "Line")
    this.type = def(options.type, "line")

    this.length = def(options.length, 0)

    this.overflow = def(options.overflow, this.length === 0)

    this.align = def(options.align, "start")

    if (options.lineType == "column") {
      this.itemAngle = def(options.itemAngle, 270)
      this.angle = def(options.angle, 90)
    } else {
      this.itemAngle = def(options.itemAngle, 0)
      this.angle = def(options.angle, 0)
    }

    this.itemSpacing = def(options.itemSpacing, 0)
  }
}

// TODO: maybe enum that (thinner messages)
type LineAlign = "start" | "end" | "justify"
type LineType = "row" | "column"

interface Mixin
  extends IdentityTrait,
    LocationTrait,
    ChildTrait,
    ParentArrayTrait,
    LabelTrait,
    OwnershipTrait,
    SelectableChildrenTrait {}

type LineOptions = Partial<
  ConstructorType<Mixin> & {
    /**
     * Either "column" or "row".
     * Shorthand for "itemAngle" and "angle"
     */
    lineType: LineType
    /**
     * 0cm by default, sets the point of overflow.
     */
    length: number
    /**
     * How should items align within the container.
     * In zero-length container only "start" and "end" values make sense.
     */
    align: LineAlign
    /**
     * Should the items overflow over the edge,
     * or squeeze in and keep in the Lines length?
     * Remember, items don't "wrap" to "the next line".
     * Default value depends on `length`:
     * - length=0 -> overflow=true
     * - length>0 -> overflow=false
     */
    overflow: boolean
    /**
     * An angle at which items are rotated by default.
     * Line looks like a row by default. To make a column
     */
    itemAngle: number
    /**
     * Margin or overlapping (negative values) between items
     */
    itemSpacing: number
  }
>

export interface Line extends Mixin {}
