import { chalk, logs } from "@cardsgame/utils"

import { ActionTemplate } from "./actionTemplate"
import { Conditions } from "./conditions"
import { ServerPlayerEvent } from "./players/player"
import { queryRunner } from "./queryRunner"
import { State } from "./state/state"
import { isChild } from "./traits/child"
import { isPlayerInteractionCommand } from "./utils"

export const filterActionsByInteraction = <S extends State>(
  event: ServerPlayerEvent
) => (action: ActionTemplate<S>): boolean => {
  const interactions = action.interactions(event.player)

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
        .some(queryRunner(definition))
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

  const conditionsChecker = new Conditions<S>(state, event)

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

/**
 * Tests if given action would pass tests when pushed to Commands Manager
 */
export const testAction = <S extends State>(
  action: ActionTemplate<S>,
  state: S,
  event: ServerPlayerEvent
): boolean => {
  return (
    filterActionsByInteraction(event)(action) &&
    filterActionsByConditions(state, event)(action)
  )
}
