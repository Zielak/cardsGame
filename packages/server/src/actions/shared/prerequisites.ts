import { logs } from "@cardsgame/utils"

import { ENTITY_INTERACTION } from "../../interaction/types.js"
import type { ServerPlayerMessage } from "../../player/serverPlayerMessage.js"
import { queryRunner } from "../../queries/runner.js"
import { isChild } from "../../traits/child.js"

import type { InteractionQueries } from "./types.js"

export function checkInteractionQueries(
  message: ServerPlayerMessage,
  interactionQueries: InteractionQueries
): boolean {
  const interactions = interactionQueries(message.player)

  const isCatchAll = interactions === "*"

  if (isCatchAll) {
    logs.debug(`got "catch-all" interaction definition`)
    return true
  }

  logs.debug(
    `got`,
    interactions.length,
    `interaction definition${interactions.length > 1 ? "s" : ""}`,
    interactions.map((def) => JSON.stringify(def))
  )

  // Expecting interaction but without entity reference?
  if (
    !message.entity &&
    message.messageType === ENTITY_INTERACTION &&
    interactions.length === 0
  ) {
    return true
  }

  return interactions.some((definition) => {
    // Check props for every interactive entity in `targets` array
    return message.entities
      ?.filter((currentTarget) =>
        isChild(currentTarget) ? currentTarget.isInteractive() : false
      )
      .some((entity) => {
        const result = queryRunner(definition)(entity)
        if (result) {
          logs.log("match!")
        }
        return result
      })
  })
}
