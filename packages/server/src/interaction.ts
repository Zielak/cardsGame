import { chalk, logs } from "@cardsgame/utils"

import {
  ActionTemplate,
  isInteractionOfEntities,
  isInteractionOfEvent,
} from "./actionTemplate"
import { Conditions, ConditionsMethods } from "./conditions"
import { ServerPlayerEvent } from "./players/player"
import { queryRunner } from "./queryRunner"
import { State } from "./state/state"
import { isChild } from "./traits/child"

export const filterActionsByInteraction = <S extends State>(
  event: ServerPlayerEvent
) => (action: ActionTemplate<S>): boolean => {
  if (event.entity && isInteractionOfEntities(action)) {
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
  } else if (event.command && isInteractionOfEvent(action)) {
    return action.interaction === event.command
  }
  return false
}

export class ClientEventConditions<S extends State> extends Conditions<
  S,
  ClientEventConditions<S>
> {}

export interface ClientEventConditions<S extends State> {
  /**
   * Changes current `subject` to game-specific player command. Defaults to "EntityInteraction"
   */
  command: ConditionsMethods<S, ClientEventConditions<S>> //string;
  /**
   * Changes current `subject` to Interaction-related events ("click", "touchstart"...)
   */
  event: ConditionsMethods<S, ClientEventConditions<S>> //string;
  /**
   * Changes current `subject` to event's additional data
   */
  data: ConditionsMethods<S, ClientEventConditions<S>> //any;
  /**
   * Changes current `subject` to interacting `Player`
   */
  player: ConditionsMethods<S, ClientEventConditions<S>> //Player;
  /**
   * Changes current `subject` to entity being interacted with
   */
  entity: ConditionsMethods<S, ClientEventConditions<S>> //unknown;
}

export const filterActionsByConditions = <S extends State>(
  state: S,
  event: ServerPlayerEvent
) => (action: ActionTemplate<S>): boolean => {
  logs.group(`action: ${chalk.white(action.name)}`)

  const initialSubjects = Object.keys(event)
    .filter((key) => !["timestamp", "entities", "entityPath"].includes(key))
    .reduce((o, key) => {
      o[key] = event[key]
      return o
    }, {})

  const conditionsChecker = new ClientEventConditions<S>(state, initialSubjects)

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
