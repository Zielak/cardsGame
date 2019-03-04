import { Entity } from "../entity"
import { ServerPlayerEvent } from "../player"
import { logs } from "../logs"

const propsMatch = (propName: string, values: any[]) => (entity: Entity) => {
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

export const matchRank = (_ranks: string | string[]) => {
  const ranks = Array.isArray(_ranks) ? _ranks : [_ranks]

  return (_, event: ServerPlayerEvent) => {
    const selected = event.player.selectedEntities
    return selected.every(propsMatch("rank", ranks))
  }
}

export default {
  matchRank
}
