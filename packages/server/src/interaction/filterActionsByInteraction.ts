import { logs } from "@cardsgame/utils"

import type { ActionTemplate } from "../actions/actionTemplate.js"
import {
  isInteractionOfEntities,
  isInteractionOfEvent,
} from "../actions/typecheck.js"
import type { ServerPlayerMessage } from "../player/serverPlayerMessage.js"
import { queryRunner } from "../queries/runner.js"
import type { State } from "../state/state.js"
import { isChild } from "../traits/child.js"

/**
 * Used internally and in `@cardsgame/server-testing` package.
 * Not for public usage
 * @ignore
 */
export const filterActionsByInteraction =
  <S extends State>(message: ServerPlayerMessage) =>
  (action: ActionTemplate<S>): boolean => {
    if (isInteractionOfEntities(action)) {
      if (
        "interactionType" in action &&
        action.interactionType !== message.interaction
      ) {
        return false
      }

      const interactions = action.interaction(message.player)

      logs.debug(
        action.name,
        `got`,
        interactions.length,
        `entity interaction${interactions.length > 1 ? "s" : ""}`,
        interactions.map((def) => JSON.stringify(def))
      )

      return interactions.some((definition) => {
        // Check props for every interactive entity in `targets` array
        return message.entities
          .filter((currentTarget) =>
            isChild(currentTarget) ? currentTarget.isInteractive() : false
          )
          .some((entity) => {
            const result = queryRunner(definition)(entity)
            if (result) {
              logs.log(action.name, "match!")
            }
            return result
          })
      })
    } else if (isInteractionOfEvent(action)) {
      return action.messageType === message.messageType
    }
    return false
  }
