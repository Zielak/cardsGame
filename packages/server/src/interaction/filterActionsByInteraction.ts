import { logs } from "@cardsgame/utils"

import {
  ActionTemplate,
  isInteractionOfEntities,
  isInteractionOfEvent,
} from "../actionTemplate"
import type { ServerPlayerMessage } from "../player"
import { queryRunner } from "../queryRunner"
import type { State } from "../state"
import { isChild } from "../traits"

export const filterActionsByInteraction =
  <S extends State>(message: ServerPlayerMessage) =>
  (action: ActionTemplate<S>): boolean => {
    if (isInteractionOfEntities(action)) {
      if (action.interactionType !== message.interaction) {
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
