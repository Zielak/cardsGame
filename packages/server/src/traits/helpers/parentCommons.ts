import { QuerableProps, queryRunner } from "../../queryRunner"
import { ChildTrait } from "../child"
import { isParent, ParentTrait } from "../parent"

/**
 * Find one item matching props.
 * @param props
 */
export function query<T extends ChildTrait>(
  this: ParentTrait,
  props: QuerableProps
): T {
  // Grab all current children
  const children = this.getChildren<T>()

  // Check if maybe some of them match the query
  const firstLevel = children.find(queryRunner<T>(props))

  if (firstLevel) {
    return firstLevel
  }

  // Keep querying for the same props in children if they're also parents

  for (const entity of children) {
    if (!isParent(entity)) continue

    const result = entity.query<T>(props)
    if (result) {
      return result
    }
  }
}

/**
 * Looks for every matching entity here and deeper
 */
export function queryAll<T extends ChildTrait>(
  this: ParentTrait,
  props: QuerableProps
): T[] {
  const result: (ChildTrait & T)[] = []

  // Grab all current children
  const children = this.getChildren<T>()

  // Check if maybe some of them match the query
  result.push(...children.filter(queryRunner<T>(props)))

  // Keep querying for the same props in children if they're also parents
  for (const entity of children) {
    if (!isParent(entity)) continue

    result.push(...entity.queryAll<T>(props))
  }

  return result
}
