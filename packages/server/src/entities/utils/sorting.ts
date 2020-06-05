import { ChildTrait } from "../../traits/child"

export type SortingFunction = (childA: ChildTrait, childB: ChildTrait) => number

export function sortOnChildAdded(child: ChildTrait) {
  if (!this.autoSort) return
  const count = this.countChildren()

  for (let idx = 0; idx < count; idx++) {
    if (this.autoSort(child, this.getChild(idx)) > 0) {
      continue
    }
    // I shall drop incoming child right here
    this.moveChildTo(child.idx, idx)
    break
  }
}
