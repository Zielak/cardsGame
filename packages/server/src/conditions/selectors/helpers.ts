import { IEntity } from "../../traits/entity"
import { logs } from "@cardsgame/utils"

export const propsMatch = (propName: string, values: any[]) => (
  entity: IEntity
) => {
  const result = values.some(value => entity[propName] === value)
  if (!result) {
    logs.verbose(
      `propsMatch ${propName}`,
      `entity[${propName}] doesn't match any accepted values:`,
      values
    )
  }
  return result
}
