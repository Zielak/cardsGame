import { ParentTrait, countChildren } from "./parent"

export class SelectableChildrenTrait extends ParentTrait {
  selectedChildren: boolean[]
}

SelectableChildrenTrait.constructor = (
  entity: SelectableChildrenTrait
  // state: State,
  // options: SelectableChildrenTrait
) => {
  entity.selectedChildren = []
}

// TODO: React on child removed(!)/added(~?)

const ensureIndex = (parent: SelectableChildrenTrait, index: number) => {
  if (typeof index !== "number")
    throw new Error("selectChildAt | should be a number!")
  if (countChildren(parent) - 1 < index)
    throw new Error(
      `selectChildAt | this parent doesn't have child at index ${index}`
    )
}

export function selectChildAt(parent: SelectableChildrenTrait, index: number) {
  ensureIndex(parent, index)
  parent.selectedChildren[index] = true
}

export function deSelectChildAt(
  parent: SelectableChildrenTrait,
  index: number
) {
  ensureIndex(parent, index)
  parent.selectedChildren[index] = false
}

export function toggleSelectionChildAt(
  parent: SelectableChildrenTrait,
  index: number
) {
  ensureIndex(parent, index)
  parent.selectedChildren[index] = !parent.selectedChildren[index]
}
