import { Command, Target, TargetHolder } from "../command"
import { SelectableChildrenTrait } from "../traits/selectableChildren"
import { ParentTrait } from "../traits/parent"

type ParentSelecta = SelectableChildrenTrait & ParentTrait

export class Select extends Command {
  private indexes: number[]
  private parent: TargetHolder<ParentSelecta>

  /**
   * Mark items as selected
   * @param parent target parent of child elements you want to select
   * @param idx single number or array of all indexes to select. Omit to SELECT ALL.
   */
  constructor(parent: Target<ParentSelecta>, idx?: number | number[]) {
    super()

    this.parent = new TargetHolder<ParentSelecta>(parent)

    if (typeof idx !== "undefined") {
      this.indexes = Array.isArray(idx) ? idx : [idx]
    }
  }

  async execute(): Promise<void> {
    const parent = this.parent.get()

    if (this.indexes) {
      this.indexes.forEach(idx => parent.selectChildAt(idx))
    } else {
      this.indexes = []
      parent.getUnselectedChildren().forEach(child => {
        this.indexes.push(child.idx)
        parent.selectChildAt(child.idx)
      })
    }
  }
  async undo(): Promise<void> {
    const parent = this.parent.get()

    this.indexes.forEach(idx => parent.deselectChildAt(idx))
  }
}

export class Deselect extends Command {
  private indexes: number[]
  private parent: TargetHolder<ParentSelecta>

  /**
   * Clear selection marking from items
   * @param parent target parent of child elements you want to deselect
   * @param idx single number or array of all indexes to deselect. Omit to DESELECT ALL.
   */
  constructor(parent: Target<ParentSelecta>, idx?: number | number[]) {
    super()

    this.parent = new TargetHolder<ParentSelecta>(parent)

    if (typeof idx !== "undefined") {
      this.indexes = Array.isArray(idx) ? idx : [idx]
    }
  }

  async execute(): Promise<void> {
    const parent = this.parent.get()

    if (this.indexes) {
      this.indexes.forEach(idx => parent.deselectChildAt(idx))
    } else {
      this.indexes = []
      parent.getSelectedChildren().forEach(child => {
        this.indexes.push(child.idx)
        parent.deselectChildAt(child.idx)
      })
    }
  }
  async undo(): Promise<void> {
    const parent = this.parent.get()

    this.indexes.forEach(idx => parent.selectChildAt(idx))
  }
}

export class ToggleSelection extends Command {
  private lastStates: boolean[]
  private indexes: number[]
  private parent: TargetHolder<ParentSelecta>

  /**
   * Toggle selection marking of items
   * @param parent target parent of child elements you want to toggle selection
   * @param idx single number or array of all indexes to toggle. Omit to TOGGLE ALL.
   */
  constructor(parent: Target<ParentSelecta>, idx: number | number[]) {
    super()

    this.parent = new TargetHolder<ParentSelecta>(parent)

    this.lastStates = []
    if (typeof idx !== "undefined") {
      this.indexes = Array.isArray(idx) ? idx : [idx]
    }
  }

  async execute(): Promise<void> {
    const parent = this.parent.get()

    if (!this.indexes) {
      this.indexes = parent.getChildren().map(child => child.idx)
    }
    this.indexes.forEach(childIdx => {
      this.lastStates[childIdx] = parent.isChildSelected(childIdx)
      if (this.lastStates[childIdx]) {
        parent.deselectChildAt(childIdx)
      } else {
        parent.selectChildAt(childIdx)
      }
    })
  }
  async undo(): Promise<void> {
    const parent = this.parent.get()

    this.indexes.forEach(idx => {
      if (this.lastStates[idx]) {
        parent.selectChildAt(idx)
      } else {
        parent.deselectChildAt(idx)
      }
    })
  }
}
