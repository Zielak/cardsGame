import { ArraySchema, Schema } from "@colyseus/schema"

import { type } from "../annotations/type.js"

import type { ChildTrait } from "./child.js"
import { isParent, ParentTrait } from "./parent.js"

class SelectedChildData extends Schema {
  @type("uint16") childIndex: number
  @type("uint8") selectionIndex: number

  constructor(childIndex: number, selectionIndex: number) {
    super()
    this.childIndex = childIndex
    this.selectionIndex = selectionIndex
  }

  toString(): string {
    return `{${this.selectionIndex}: ${this.childIndex}}`
  }
}

/**
 *
 * @param entity
 * @returns
 * @category SelectableChildren
 */
export function hasSelectableChildren(
  entity: unknown
): entity is SelectableChildrenTrait {
  return (
    typeof entity == "object" &&
    typeof (entity as SelectableChildrenTrait).selectedChildren !== "undefined"
  )
}

/**
 * Used on **container** - its children can now be selected by players.
 *
 * Holds indexes of selected children and in which order were these chosen.
 *
 * > TODO: This trait is clearly dependant on ParentTrait. There should be a way of checking/ensuring this dependency is met
 * @category SelectableChildren
 */
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

    // Also ensure we won't push duplicates here
    const alreadyThere = this.selectedChildren.find(
      (data) => data?.childIndex === childIndex
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
      (data) => data?.childIndex === childIndex
    )
    if (dataIdx >= 0) {
      this.selectedChildren.splice(dataIdx, 1)
    }

    // Ensure selectedIndexes are right
    this.selectedChildren.sort(sortBySelectionIndex).forEach((data, idx) => {
      data.selectionIndex = idx
    })
  }

  isChildSelected(childIndex: number): boolean {
    return this.selectedChildren.some((data) => data?.childIndex === childIndex)
  }

  /**
   * In which order was nth child selected. Returns `undefined` on index of UNselected child.
   * @param childIndex index of child
   */
  getSelectionIndex(childIndex: number): number {
    return this.selectedChildren.find((data) => data?.childIndex === childIndex)
      ?.selectionIndex
  }
  /**
   * Number of selected child elements
   */
  countSelectedChildren(): number {
    return this.selectedChildren.filter((v) => v).length
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

    return this.selectedChildren
      .sort(sortBySelectionIndex)
      .map((data) => this.getChild<T>(data.childIndex))
      .filter((v) => v)
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

    if (typeof index !== "number") {
      throw new Error(`ensureIndex | should be a number!`)
    }

    if (index < 0) {
      throw new Error(`ensureIndex | can't go negative on me: ${index}`)
    }

    if (this.countChildren() - 1 < index) {
      throw new Error(
        `ensureIndex | this parent doesn't have child at index ${index}`
      )
    }
  }
}

SelectableChildrenTrait["trait"] =
  function constructSelectableChildrenTrait(): void {
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
    const selectionRefIndex = this.selectedChildren.findIndex(
      (data) => data?.childIndex === childIndex
    )

    if (selectionRefIndex >= 0) {
      this.selectedChildren.splice(selectionRefIndex, 1)
    }

    this.selectedChildren.forEach((data, idx) => {
      data.selectionIndex = idx
    })
  },
  childIndexUpdated: function (
    this: SelectableChildrenTrait,
    oldIdx: number,
    newIdx: number
  ): void {
    const selectionData = this.selectedChildren.find(
      (data) => data?.childIndex === oldIdx
    )
    if (selectionData) {
      selectionData.childIndex = newIdx
    }
  },
}

function sortBySelectionIndex(a, b): number {
  return a.selectionIndex - b.selectionIndex
}
