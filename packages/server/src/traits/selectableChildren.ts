import { ArraySchema, Schema } from "@colyseus/schema"

import { ChildTrait } from "./child"
import { isParent } from "./parent"
import { type } from "../annotations"

class SelectedChildData extends Schema {
  @type("uint16") childIndex: number
  @type("uint8") selectionIndex: number

  constructor(childIndex: number, selectionIndex: number) {
    super()
    this.childIndex = childIndex
    this.selectionIndex = selectionIndex
  }
}

export function hasSelectableChildren(
  entity: any
): entity is SelectableChildrenTrait {
  return (
    typeof entity == "object" &&
    typeof (entity as SelectableChildrenTrait).selectedChildren !== "undefined"
  )
}

export class SelectableChildrenTrait {
  // This hopefully is available by mixing in ParentTrait.
  childrenPointers: string[]

  selectedChildren: ArraySchema<SelectedChildData>

  /**
   * Select child
   */
  selectChildAt(childIndex: number) {
    this.ensureIndex(childIndex)

    // Also ensure we won't push duplicate here
    const alreadyThere = this.selectedChildren.find(
      data => data.childIndex === childIndex
    )
    if (!alreadyThere) {
      this.selectedChildren.push(
        new SelectedChildData(childIndex, this.countSelectedChildren())
      )
    }
  }

  /**
   * Deselect child
   */
  deselectChildAt(childIndex: number) {
    this.ensureIndex(childIndex)

    const dataIdx = this.selectedChildren.findIndex(
      data => data.childIndex === childIndex
    )
    if (dataIdx >= 0) {
      this.selectedChildren.splice(dataIdx, 1)
    }
    // Ensure selectedIndexes are right
    this.selectedChildren.forEach((data, idx) => {
      data.selectionIndex = idx
    })
  }

  isChildSelected(childIndex: number): boolean {
    return this.selectedChildren.some(data => data.childIndex === childIndex)
  }

  /**
   * In which order was nth child selected
   * @param childIndex
   */
  getSelectionIndex(childIndex: number): number {
    return this.selectedChildren.find(data => data.childIndex === childIndex)
      .selectionIndex
  }

  /**
   * Number of selected child elements
   */
  countSelectedChildren(): number {
    return this.selectedChildren.length
  }

  /**
   * Number of not selected child elements
   */
  countUnselectedChildren(): number {
    const me = this
    if (!isParent(me)) {
      return 0
    }
    return me.countChildren() - this.countSelectedChildren()
  }

  getSelectedChildren<T extends ChildTrait>(): T[] {
    const me = this
    if (!isParent(me)) {
      return []
    }

    return Array.from(me.selectedChildren)
      .sort((a, b) => a.selectionIndex - b.selectionIndex)
      .map(data => me.getChild(data.childIndex))
  }

  getUnselectedChildren<T extends ChildTrait>(): T[] {
    const me = this
    if (!isParent(me)) {
      return []
    }

    return me.getChildren<T>().filter(child => !this.isChildSelected(child.idx))
  }

  protected ensureIndex(index: number) {
    const me = this
    if (!isParent(me)) {
      throw new Error(`ensureIndex | I'm not a parent!`)
    }

    if (typeof index !== "number")
      throw new Error(`ensureIndex | should be a number!`)

    if (index < 0) {
      throw new Error(`ensureIndex | can't go negative on me: ${index}`)
    }

    if (me.countChildren() - 1 < index)
      throw new Error(
        `ensureIndex | this parent doesn't have child at index ${index}`
      )
  }
}

;(SelectableChildrenTrait as any).trait = function SelectableChildrenTrait() {
  this.selectedChildren = new ArraySchema()
}
;(SelectableChildrenTrait as any).typeDef = {
  selectedChildren: [SelectedChildData]
}
;(SelectableChildrenTrait as any).hooks = {
  childRemoved: function(this: SelectableChildrenTrait, childIndex: number) {
    const index = this.selectedChildren.findIndex(
      data => data.childIndex === childIndex
    )
    if (index >= 0) {
      this.selectedChildren.splice(index, 1)
    }
  },
  childIndexUpdated: function(
    this: SelectableChildrenTrait,
    oldIdx: number,
    newIdx: number
  ) {
    const data = this.selectedChildren.find(
      data => data.selectionIndex === oldIdx
    )
    if (data) {
      data.selectionIndex = newIdx
    }
  }
}
