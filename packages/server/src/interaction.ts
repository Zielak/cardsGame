import { chalk, logs } from "@cardsgame/utils"

import { ActionTemplate } from "./actionTemplate"
import { InteractionConditions } from "./conditions/interaction"
import { ServerPlayerEvent } from "./players/player"
import { QuerableProps, queryRunner } from "./queryRunner"
import { State } from "./state/state"
import { isChild } from "./traits/child"
import { isPlayerInteractionCommand } from "./utils"

const interactionMatchesEntity = (definition: QuerableProps) => (
  entity: unknown
): boolean => queryRunner(definition)(entity)

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
    if (isPlayerInteractionCommand(definition)) {
      // Definition speaks of command, event should be command and match
      return definition.command === event.command
    } else if (event.entities) {
      // Check props for every interactive entity in `targets` array
      return event.entities
        .filter((currentTarget) =>
          isChild(currentTarget) ? currentTarget.isInteractive() : false
        )
        .some(interactionMatchesEntity(definition))
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

  logs.groupEnd(
    `result: ${result ? chalk.green(result) : chalk.yellow(result)}`
  )

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
