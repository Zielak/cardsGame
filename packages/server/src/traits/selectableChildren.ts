import { ArraySchema, Schema } from "@colyseus/schema"

import { type } from "../annotations/type"
import { ChildTrait } from "./child"
import { isParent, ParentTrait } from "./parent"

// TODO: This trait is clearly dependant on ParentTrait. There should be a way of checking/ensuring this dependency is met

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
  entity: unknown
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
  ): void {
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
  ): void {
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
  ): void {
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

SelectableChildrenTrait[
  "trait"
] = function constructorSelectableChildrenTrait(): void {
  this.selectedChildren = new ArraySchema()
}
SelectableChildrenTrait["typeDef"] = {
  selectedChildren: [SelectedChildData],
}
SelectableChildrenTrait["hooks"] = {
  childRemoved: function (
    this: SelectableChildrenTrait,
    childIndex: number
  ): void {
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
  ): void {
    const selectionData = this.selectedChildren.find(
      (data) => data.childIndex === oldIdx
    )
    if (selectionData) {
      selectionData.childIndex = newIdx
    }
  },
}
