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
  const cond: ICondition = (state: State, event: ServerPlayerEvent) => {
    const ents = Array.isArray(entities) ? entities : [entities]
    const target = event.entity
    const matches = ents.every(entity => entity[propName] === target[propName])
    if (!matches) {
      logs.warn(
        "matchesPropWith",
        `${sentenceCase(target.type)}'s "${
          target.name
        }" property "${propName}" doesn't match other selected entities:`,
        ents.map(el => `${el.name}.${propName}:${el[propName]}`)
      )
    }
    return matches
  }
  cond._name = "matchesPropWith"
  return cond
}
