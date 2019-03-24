import { State } from "../state"
import { ICondition, IConditionFactory } from "../condition"
import { ServerPlayerEvent } from "../player"
import { logs } from "../logs"
import { sentenceCase } from "@cardsgame/utils"
import { Entity } from "../entity"

export const matchesPropWith: IConditionFactory = (
  propName: string,
  entities: (state: State, event: ServerPlayerEvent) => Entity[]
) => {
  const cond: ICondition = (state: State, event: ServerPlayerEvent) => {
    const target = event.entity
    const ents = entities(state, event)
    const matches = ents.every(entity => {
      return entity[propName] === target[propName]
    })
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
