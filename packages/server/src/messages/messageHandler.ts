import type { Room } from "@colyseus/core"

import { ENTITY_INTERACTION } from "../interaction/constants.js"

import { botAdd, botRemove } from "./bots.js"
import { entityInteraction } from "./entityInteraction.js"
import { start } from "./start.js"

/**
 * @ignore
 */
export const messages = new Map<string, Parameters<Room["onMessage"]>[1]>([
  ["start", start],
  ["bot_add", botAdd],
  ["bot_remove", botRemove],
  [ENTITY_INTERACTION, entityInteraction],
])
