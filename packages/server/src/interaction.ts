import { chalk, logs } from "@cardsgame/utils"

import { ActionTemplate, InteractionDefinition } from "./actionTemplate"
import { InteractionConditions } from "./conditions/interaction"
import { ServerPlayerEvent } from "./players/player"
import { State } from "./state/state"
import { isChild } from "./traits/child"

export const interactionMatchesEntity = (definition: InteractionDefinition) => (
  entity: unknown
): boolean => {
  // Every KEY in definition should be present
  // in the Entity and be of equal value
  // or either of values if its an array
  return Object.keys(definition).every((prop: string) => {
    const value = definition[prop]

    // Is simple type or array of these, NOT an {object}
    if (Array.isArray(value) || typeof value !== "object") {
      const values = Array.isArray(value) ? value : [value]
      return values.some((testValue) => entity[prop] === testValue)
    }
    if (prop === "parent" && isChild(entity)) {
      const parentOfCurrent = entity.parent

      return parentOfCurrent
        ? interactionMatchesEntity(value)(parentOfCurrent)
        : // You gave me some definition of "parent"
          // But I don't have a parent...
          false
    }
  })
}

export const filterActionsByInteraction = <S extends State>(
  event: ServerPlayerEvent
) => (action: ActionTemplate<S>): boolean => {
  const interactions = action.interactions()

  logs.verbose(
    action.name,
    `got`,
    interactions.length,
    `interaction${interactions.length > 1 ? "s" : ""}`,
    interactions.map((def) => JSON.stringify(def))
  )

  const result = interactions.some((definition) => {
    if (
      event.entities &&
      (!definition.command || definition.command === "EntityInteraction")
    ) {
      // Check props for every interactive entity in `targets` array
      return event.entities
        .filter((currentTarget) =>
          isChild(currentTarget) ? currentTarget.isInteractive() : false
        )
        .some(interactionMatchesEntity(definition))
    } else if (definition.command) {
      return definition.command === event.command
    }
  })

  if (result) {
    logs.notice(action.name, "match!")
  }

  return result
}

export const filterActionsByConditions = <S extends State>(
  state: S,
  event: ServerPlayerEvent
) => (action: ActionTemplate<S>): boolean => {
  logs.group(`action: ${chalk.white(action.name)}`)

  const conditionsChecker = new InteractionConditions<S>(state, event)

  let result = true
  let message = ""
  try {
    action.checkConditions(conditionsChecker)
  } catch (e) {
    result = false
    message = (e as Error).message
  }

  if (message) {
    logs.verbose("\t", message)
  }
  logs.verbose(`result: ${result}`)

  logs.groupEnd()

  return result
}

// /**
//  * Gets you a list of all possible game actions
//  * that match with player's interaction
//  */
// export const filterActionsByInteraction = <S extends State>(
//   event: ServerPlayerEvent
// ): ActionTemplate<S>[] => {
//   logs.groupCollapsed(`Filter out actions by INTERACTIONS`)

//   const actions = Array.from(this.possibleActions.values()).filter(<S>(event))

//   logs.groupEnd()

//   // const logActions = actions.map(el => el.name)
//   logs.info(
//     "performAction",
//     actions.length,
//     `actions by this interaction`
//     // logActions
//   )

//   return actions
// }
