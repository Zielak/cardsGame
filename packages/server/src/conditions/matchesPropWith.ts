import { State } from "../state"
import { ICondition } from "."
import { ServerPlayerEvent } from "../player"
import { logs } from "@cardsgame/utils"
import { sentenceCase } from "@cardsgame/utils"
import { IEntity } from "../traits/entity"

/**
 * Interacted entity's prop needs to match with other specified entity/ies
 * @param propName
 * @param entities
 */
export const matchesPropWith = (
  propName: string,
  entities: IEntity | IEntity[]
) => {
  const ents = Array.isArray(entities) ? entities : [entities]

  const matchesPropWith: ICondition = (
    state: State,
    event: ServerPlayerEvent
  ) => {
    const target = event.entity
    const matches = ents.every(entity => entity[propName] === target[propName])

    return matches
  }
  // cond.name = `matchesProp(${propName})With(${
  //   ents.length > 5 ? ents.length + " entities" : ents.map(e => e.name)
  // })`
  return matchesPropWith
}
