import { ArraySchema } from "@colyseus/schema"

import { ChildTrait } from "./child"
import { isParent } from "./parent"

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

  selectedChildren: ArraySchema<boolean>

  /**
   * Select child
   */
  selectChildAt(index: number) {
    this.ensureIndex(index)
    this.selectedChildren[index] = true
  }

  /**
   * Deselect child
   */
  deselectChildAt(index: number) {
    this.ensureIndex(index)
    this.selectedChildren[index] = false
  }

  isChildSelected(index: number): boolean {
    return this.selectedChildren[index]
  }

  /**
   * Number of selected child elements
   */
  countSelectedChildren(): number {
    return this.selectedChildren.filter(val => val === true).length
  }

  /**
   * Number of not selected child elements
   */
  countUnselectedChildren(): number {
    return this.selectedChildren.filter(val => val === false).length
  }

  getSelectedChildren<T extends ChildTrait>(): T[] {
    if (!isParent(this)) {
      return []
    }

    return this.getChildren<T>().filter(
      child => this.selectedChildren[child.idx]
    )
  }

  getUnselectedChildren<T extends ChildTrait>(): T[] {
    if (!isParent(this)) {
      return []
    }

    return this.getChildren<T>().filter(
      child => !this.selectedChildren[child.idx]
    )
  }

  protected ensureIndex(index: number) {
    if (typeof index !== "number")
      throw new Error("selectChildAt | should be a number!")

    if (index < 0) {
      throw new Error(`selectChildAt | can't go negative on me: ${index}`)
    }

    if (this.countChildren() - 1 < index)
      throw new Error(
        `selectChildAt | this parent doesn't have child at index ${index}`
      )
  }

  countChildren(): number {
    return this.childrenPointers.length
  }
}

;(SelectableChildrenTrait as any).trait = function SelectableChildrenTrait() {
  this.selectedChildren = new ArraySchema()
}
;(SelectableChildrenTrait as any).typeDef = {
  selectedChildren: ["boolean"]
}
;(SelectableChildrenTrait as any).hooks = {
  childAdded: function(this: SelectableChildrenTrait, child: ChildTrait) {
    this.selectedChildren.splice(child.idx, 0, false)
  },
  childRemoved: function(this: SelectableChildrenTrait, idx: number) {
    this.selectedChildren.splice(idx, 1)
  }
}
