import { State } from "../state"
import { IConditionFactory, ICondition } from "../condition"
import { ServerPlayerEvent } from "../player"
import { logs } from "../logs"
import { sentenceCase } from "@cardsgame/utils"

export const matchesSelectedWith: IConditionFactory = (propName: string) => {
  const cond: ICondition = (state: State, event: ServerPlayerEvent) => {
    const target = event.target
    const selected = event.player.selectedEntities
    const matches = selected.every(entity => {
      return entity[propName] === target[propName]
    })
    if (!matches) {
      logs.warn(
        "matchesSelectedWith",
        `${sentenceCase(target.type)}'s "${
          target.name
        }" property "${propName}" doesn't match other selected entities:`,
        selected.map(el => `${el.name}.${propName}:${el[propName]}`)
      )
    }
    return matches
  }
  cond._name = "matchesSelectedWith"
  return cond
}
