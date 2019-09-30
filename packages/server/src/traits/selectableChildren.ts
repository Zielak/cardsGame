import { ParentTrait } from "./parent"

// TODO: React on child removed(!)/added(~?)

export class SelectableChildrenTrait extends ParentTrait {
  selectedChildren: boolean[]

  constructor(state, options) {
    super(state, options)
    this.selectedChildren = []
  }

  selectChildAt(index: number) {
    this.ensureIndex(index)
    this.selectedChildren[index] = true
  }

  deSelectChildAt(index: number) {
    this.ensureIndex(index)
    this.selectedChildren[index] = false
  }

  toggleSelectionChildAt(index: number) {
    this.ensureIndex(index)
    this.selectedChildren[index] = !this.selectedChildren[index]
  }

  private ensureIndex(index: number) {
    if (typeof index !== "number")
      throw new Error("selectChildAt | should be a number!")
    if (this.countChildren() - 1 < index)
      throw new Error(
        `selectChildAt | this parent doesn't have child at index ${index}`
      )
  }
}
