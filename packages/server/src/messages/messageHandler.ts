import type { Room } from "@colyseus/core"

import { ENTITY_INTERACTION } from "@/interaction/constants.js"

import { botAdd } from "./bots.js"
import { entityInteraction } from "./entityInteraction.js"
import { kick } from "./kick.js"
import { ready } from "./ready.js"
import { start } from "./start.js"

/**
 * @ignore
 */
export const messages = new Map<string, Parameters<Room["onMessage"]>[1]>([
  ["ready", ready],
  ["start", start],
  ["kick", kick],
  ["bot_add", botAdd],
  [ENTITY_INTERACTION, entityInteraction],
])
