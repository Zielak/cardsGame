import { IEntity } from "../../traits/entity"
import { logs } from "../../logs"

export const propsMatch = (propName: string, values: any[]) => (
  entity: IEntity
) => {
  const result = values.some(value => entity[propName] === value)
  if (!result) {
    logs.warn(
      `propsMatch ${propName}`,
      `entity[${propName}] doesn't match any accepted values:`,
      values
    )
  }
  return result
}
