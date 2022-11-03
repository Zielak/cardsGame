import { logs } from "@cardsgame/utils"

import { type } from "./type.js"

/**
 * @ignore
 */
export const synchChildrenArray = (
  parentConstructor: AnyClass,
  childrenConstructor: AnyClass
): void => {
  const arr = []
  arr.push(childrenConstructor)

  logs.debug(
    `\`- adding  "children${childrenConstructor.name}" in ${parentConstructor.name}`
  )
  type(arr)(parentConstructor.prototype, `children${childrenConstructor.name}`)
}
