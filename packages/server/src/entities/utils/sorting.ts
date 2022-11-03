import type { ChildTrait } from "../../traits/child.js"
import type { ClassicCard } from "../classicCard.js"

export type SortingFunction = (childA: ChildTrait, childB: ChildTrait) => number

/**
 * TODO: document
 * @param child
 * @returns
 */
export function sortOnChildAdded(child: ChildTrait): void {
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

const suitScores = {
  S: 400,
  H: 300,
  D: 200,
  C: 100,
}
const rankScores = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
}
/**
 * TODO: document
 * @param childA
 * @param childB
 * @returns
 */
export const defaultHandOfCardsSorting = (
  childA: ClassicCard,
  childB: ClassicCard
): number => {
  const childAScore =
    suitScores[childA.suit] + (rankScores[childA.rank] || Number(childA.rank))
  const childBScore =
    suitScores[childB.suit] + (rankScores[childB.rank] || Number(childB.rank))

  return childAScore - childBScore
}
