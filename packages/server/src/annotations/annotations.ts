import { logs } from "@cardsgame/utils"

import { Entity } from "../traits/entity"
import { type } from "./type"

export const synchChildrenArray = (
  parentConstructor: typeof Entity,
  childrenConstructor: typeof Function
): void => {
  const arr = []
  arr.push(childrenConstructor)

  logs.verbose(
    `\`- adding  "children${childrenConstructor.name}" in ${parentConstructor.name}`
  )
  type(arr)(parentConstructor.prototype, `children${childrenConstructor.name}`)
}
