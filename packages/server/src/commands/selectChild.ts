import type { Room } from "@/room/base.js"
import type { State } from "@/state/state.js"
import type { ParentTrait } from "@/traits/parent.js"
import type { SelectableChildrenTrait } from "@/traits/selectableChildren.js"

import { Command, Target, TargetHolder } from "../command.js"
import { logs } from "../logs.js"

type ParentSelecta = SelectableChildrenTrait & ParentTrait

const logSelectedChildren = (parent: ParentSelecta): void => {
  logs.debug(
    "selected.$items:",
    Array.from(parent.selectedChildren["$items"].entries()).map(
      ([key, value]) => `[${key}]=${value}`,
    ),
  )
  logs.debug(
    "selected.$indexes:",
    Array.from(parent.selectedChildren["$indexes"].entries()).map(
      ([key, value]) => `[${key}]=${value}`,
    ),
  )
}

export class Select extends Command {
  private indexes: number[]
  private parent: TargetHolder<ParentSelecta>

  /**
   * Mark items as selected
   * @param parent target parent of child elements you want to select
   * @param idx single number or array of all entity indexes to select. Omit to SELECT ALL. These are not "selection indexes" but entity's index in its parent.
   */
  constructor(parent: Target<ParentSelecta>, idx?: number | number[]) {
    super()

    this.parent = new TargetHolder<ParentSelecta>(parent)

    if (typeof idx !== "undefined") {
      this.indexes = Array.isArray(idx) ? idx : [idx]
    }
  }

  async execute(state: State, room: Room<any>): Promise<void> {
    const parent = this.parent.get()

    if (this.indexes) {
      this.indexes.forEach((idx) => parent.selectChildAt(idx))
    } else {
      this.indexes = []
      parent.getUnselectedChildren().forEach((child) => {
        this.indexes.push(child.idx)
        parent.selectChildAt(child.idx)
      })
    }

    logs.debug(
      `Parent currently has ${parent.countSelectedChildren()} selected children`,
    )
    logSelectedChildren(parent)
  }
  async undo(state: State, room: Room<any>): Promise<void> {
    const parent = this.parent.get()

    this.indexes.forEach((idx) => parent.deselectChildAt(idx))
  }
}

export class Deselect extends Command {
  private indexes: number[]
  private parent: TargetHolder<ParentSelecta>

  /**
   * Clear selection marking from items
   * @param parent target parent of child elements you want to deselect
   * @param idx single number or array of all indexes to deselect. Omit to DESELECT ALL. These are not "selection indexes" but entity's index in its parent.
   */
  constructor(parent: Target<ParentSelecta>, idx?: number | number[]) {
    super()

    this.parent = new TargetHolder<ParentSelecta>(parent)

    if (typeof idx !== "undefined") {
      this.indexes = Array.isArray(idx) ? idx : [idx]
    }
  }

  async execute(state: State, room: Room<any>): Promise<void> {
    const parent = this.parent.get()

    if (this.indexes) {
      this.indexes.forEach((idx) => parent.deselectChildAt(idx))
    } else {
      this.indexes = []
      parent.getSelectedChildren().forEach((child) => {
        this.indexes.push(child.idx)
        parent.deselectChildAt(child.idx)
      })
    }

    logs.debug(
      `Parent currently has ${parent.countSelectedChildren()} selected children`,
    )
    logSelectedChildren(parent)
  }
  async undo(state: State, room: Room<any>): Promise<void> {
    const parent = this.parent.get()

    this.indexes.forEach((idx) => parent.selectChildAt(idx))
  }
}

export class ToggleSelection extends Command {
  private lastStates: boolean[]
  private indexes: number[]
  private parent: TargetHolder<ParentSelecta>

  /**
   * Toggle selection marking of items
   * @param parent target parent of child elements you want to toggle selection
   * @param idx single number or array of all indexes to toggle. Omit to TOGGLE ALL. These are not "selection indexes" but entity's index in its parent.
   */
  constructor(parent: Target<ParentSelecta>, idx?: number | number[]) {
    super()

    this.parent = new TargetHolder<ParentSelecta>(parent)

    this.lastStates = []
    if (typeof idx !== "undefined") {
      this.indexes = Array.isArray(idx) ? idx : [idx]
    }
  }

  async execute(state: State, room: Room<any>): Promise<void> {
    const parent = this.parent.get()

    if (!this.indexes) {
      this.indexes = parent.getChildren().map((child) => child.idx)
    }
    this.indexes.forEach((childIdx) => {
      this.lastStates[childIdx] = parent.isChildSelected(childIdx)
      if (this.lastStates[childIdx]) {
        parent.deselectChildAt(childIdx)
      } else {
        parent.selectChildAt(childIdx)
      }
    })
  }
  async undo(state: State, room: Room<any>): Promise<void> {
    const parent = this.parent.get()

    this.indexes.forEach((idx) => {
      if (this.lastStates[idx]) {
        parent.selectChildAt(idx)
      } else {
        parent.deselectChildAt(idx)
      }
    })
  }
}
