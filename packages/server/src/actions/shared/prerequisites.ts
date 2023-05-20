import { logs } from "@cardsgame/utils"

import { ENTITY_INTERACTION } from "../../interaction/types.js"
import { queryRunner } from "../../queries/runner.js"
import { State } from "../../state/state.js"
import { isChild } from "../../traits/child.js"
import { ClientMessageContext } from "../types.js"

import type { InteractionQueries } from "./types.js"

export function checkInteractionQueries<S extends State>(
  messageContext: ClientMessageContext<S>,
  interactionQueries: InteractionQueries<S>
): boolean {
  const interactions = interactionQueries(messageContext)

  const isCatchAll = interactions === "*"

  if (isCatchAll) {
    logs.debug(`got "catch-all" interaction definition`)
    return true
  }

  if (typeof interactions === "string") {
    throw new Error(
      `Invalid use of interactions, got "${interactions}" where only "*" is accepted as a string.`
    )
  }

  logs.debug(
    `got`,
    interactions.length,
    `interaction definition${interactions.length > 1 ? "s" : ""}`,
    interactions.map((def) => JSON.stringify(def))
  )

  // Expecting interaction but without entity reference?
  if (
    !messageContext.entity &&
    messageContext.messageType === ENTITY_INTERACTION &&
    interactions.length === 0
  ) {
    return true
  }

  return interactions.some((definition) => {
    // Check props for every interactive entity in `targets` array
    return messageContext.entities
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
