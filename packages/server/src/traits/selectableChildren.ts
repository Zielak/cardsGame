import { ArraySchema, Schema } from "@colyseus/schema"

import { ChildTrait } from "./child"
import { isParent, ParentTrait } from "./parent"
import { type } from "../annotations"

// TODO: Thi trait is clearly dependant on ParentTrait
// There should be a way of checking/ensuing this dependency is met

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
  selectedChildren: ArraySchema<SelectedChildData>

  /**
   * Select child
   */
  selectChildAt(
    this: ParentTrait & SelectableChildrenTrait,
    childIndex: number
  ) {
    this._selectableEnsureIndex(childIndex)

    // Also ensure we won't push duplicate here
    const alreadyThere = this.selectedChildren.find(
      (data) => data.childIndex === childIndex
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
  deselectChildAt(
    this: ParentTrait & SelectableChildrenTrait,
    childIndex: number
  ) {
    this._selectableEnsureIndex(childIndex)

    const dataIdx = this.selectedChildren.findIndex(
      (data) => data.childIndex === childIndex
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
    return this.selectedChildren.some((data) => data.childIndex === childIndex)
  }

  /**
   * In which order was nth child selected
   * @param childIndex
   */
  getSelectionIndex(childIndex: number): number {
    return this.selectedChildren.find((data) => data.childIndex === childIndex)
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
  countUnselectedChildren(this: ParentTrait & SelectableChildrenTrait): number {
    if (!isParent(this)) {
      return 0
    }
    return this.countChildren() - this.countSelectedChildren()
  }

  getSelectedChildren<T extends ChildTrait>(
    this: ParentTrait & SelectableChildrenTrait
  ): T[] {
    if (!isParent(this)) {
      return []
    }

    return Array.from(this.selectedChildren)
      .sort((a, b) => a.selectionIndex - b.selectionIndex)
      .map((data) => this.getChild(data.childIndex))
  }

  getUnselectedChildren<T extends ChildTrait>(
    this: ParentTrait & SelectableChildrenTrait
  ): T[] {
    if (!isParent(this)) {
      return []
    }

    return this.getChildren<T>().filter(
      (child) => !this.isChildSelected(child.idx)
    )
  }

  _selectableEnsureIndex(
    this: ParentTrait & SelectableChildrenTrait,
    index: number
  ) {
    if (!isParent(this)) {
      throw new Error(`ensureIndex | I'm not a parent!`)
    }

    if (typeof index !== "number")
      throw new Error(`ensureIndex | should be a number!`)

    if (index < 0) {
      throw new Error(`ensureIndex | can't go negative on me: ${index}`)
    }

    if (this.countChildren() - 1 < index)
      throw new Error(
        `ensureIndex | this parent doesn't have child at index ${index}`
      )
  }
}

;(SelectableChildrenTrait as any).trait = function SelectableChildrenTrait() {
  this.selectedChildren = new ArraySchema()
}
;(SelectableChildrenTrait as any).typeDef = {
  selectedChildren: [SelectedChildData],
}
;(SelectableChildrenTrait as any).hooks = {
  childRemoved: function (this: SelectableChildrenTrait, childIndex: number) {
    const index = this.selectedChildren.findIndex(
      (data) => data.childIndex === childIndex
    )
    if (index >= 0) {
      this.selectedChildren.splice(index, 1)
    }
  },
  childIndexUpdated: function (
    this: SelectableChildrenTrait,
    oldIdx: number,
    newIdx: number
  ) {
    const data = this.selectedChildren.find(
      (data) => data.selectionIndex === oldIdx
    )
    if (data) {
      data.selectionIndex = newIdx
    }
  },
}
