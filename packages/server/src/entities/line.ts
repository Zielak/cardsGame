/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { def } from "@cardsgame/utils"

import { canBeChild } from "../annotations/canBeChild.js"
import { containsChildren } from "../annotations/containsChildren.js"
import { type } from "../annotations/type.js"
import type { State } from "../state/state.js"
import { ChildTrait } from "../traits/child.js"
import { applyTraitsMixins, Entity } from "../traits/entity.js"
import { IdentityTrait } from "../traits/identity.js"
import { LabelTrait } from "../traits/label.js"
import { LocationTrait } from "../traits/location.js"
import { OwnershipTrait } from "../traits/ownership.js"
import { ParentTrait } from "../traits/parent.js"
import { SelectableChildrenTrait } from "../traits/selectableChildren.js"

/**
 * A container of items to be placed in linear fashion.
 * @category Entity
 */
@canBeChild
@containsChildren
@applyTraitsMixins([
  IdentityTrait,
  LocationTrait,
  ChildTrait,
  ParentTrait,
  LabelTrait,
  OwnershipTrait,
  SelectableChildrenTrait,
])
export class Line extends Entity<LineOptions> {
  /**
   * Sets maximum size of this container.
   * - 0cm (default): items just sit next to each other
   * - Any positive value: when approaching the size limit,
   *   items will squeeze in to stay within limits
   *
   * Remember, items never "*wrap*" to "*the next line*".
   * @category Line
   */
  @type("float32") length: number

  /**
   * How should items align within the container.
   * In zero-length container only "start" and "end" values make sense.
   * @category Line
   */
  @type("string") align: LineAlign

  /**
   * How should items align within the container.
   * In zero-length container only "start" and "end" values make sense.
   * @category Line
   */
  @type("string") lineDirection: LineDirection

  /**
   * Margin or overlapping (negative values) between items
   * @category Line
   */
  @type("float32") itemSpacing: number

  create(state: State, options: LineOptions = {}): void {
    this.name = def(options.name, "Line")
    this.type = def(options.type, "line")

    this.hijacksInteractionTarget = def(options.hijacksInteractionTarget, false)

    this.length = def(options.length, 0)
    this.align = def(options.align, "start")
    this.lineDirection = def(options.lineDirection, "row")
    this.itemSpacing = def(options.itemSpacing, 0)
  }
}

// TODO: maybe enum that (thinner messages)
type LineAlign = "start" | "end" | "justify"
type LineDirection = "row" | "column"

interface Mixin
  extends IdentityTrait,
    LocationTrait,
    ChildTrait,
    ParentTrait,
    LabelTrait,
    OwnershipTrait,
    SelectableChildrenTrait {}

type LineOptions = Partial<
  NonFunctionProperties<Mixin> & {
    /**
     * Sets maximum size of this container.
     * - 0cm (default): items just sit next to each other
     * - Any positive value: when approaching the size limit,
     *   items will squeeze in to stay within limits
     *
     * Remember, items never "*wrap*" to "*the next line*".
     */
    length: number
    /**
     * How should items align within the container.
     * In zero-length container only "start" and "end" values make sense.
     */
    align: LineAlign
    /**
     * How should items align within the container.
     * In zero-length container only "start" and "end" values make sense.
     */
    lineDirection: LineDirection
    /**
     * Margin or overlapping (negative values) between items
     */
    itemSpacing: number
  }
>

export interface Line extends Mixin {}
