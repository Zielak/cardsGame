import { chalk, logs, omit } from "@cardsgame/utils"

import {
  ActionTemplate,
  isInteractionOfEntities,
  isInteractionOfEvent,
} from "./actionTemplate"
import { Conditions } from "./conditions"
import { ServerPlayerEvent } from "./players/player"
import { queryRunner } from "./queryRunner"
import { State } from "./state/state"
import { isChild } from "./traits/child"

export const filterActionsByInteraction = <S extends State>(
  event: ServerPlayerEvent
) => (action: ActionTemplate<S>): boolean => {
  if (isInteractionOfEntities(action)) {
    const interactions = action.interaction(event.player)

    logs.verbose(
      action.name,
      `got`,
      interactions.length,
      `entity interaction${interactions.length > 1 ? "s" : ""}`,
      interactions.map((def) => JSON.stringify(def))
    )

    return interactions.some((definition) => {
      // Check props for every interactive entity in `targets` array
      return event.entities
        .filter((currentTarget) =>
          isChild(currentTarget) ? currentTarget.isInteractive() : false
        )
        .some((entity) => {
          const result = queryRunner(definition)(entity)
          if (result) {
            logs.notice(action.name, "match!")
          }
          return result
        })
    })
  } else if (isInteractionOfEvent(action)) {
    return action.interaction === event.command
  }
  return false
}

export type ClientEventSubjects = Omit<
  ServerPlayerEvent,
  "timestamp" | "entities" | "entityPath"
>

export const filterActionsByConditions = <S extends State>(
  state: S,
  event: ServerPlayerEvent
) => (action: ActionTemplate<S>): boolean => {
  logs.group(`action: ${chalk.white(action.name)}`)

  const conditionsChecker = new Conditions<S, ClientEventSubjects>(
    state,
    omit(event, ["timestamp", "entities", "entityPath"])
  )

  let result = true
  let message = ""
  try {
    action.conditions(conditionsChecker)
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
