import type { Room } from "@colyseus/core"

import { botAdd, botRemove } from "./bots"
import { entityInteraction } from "./entityInteraction"
import { start } from "./start"

export const messages = new Map<string, Parameters<Room["onMessage"]>[1]>([
  ["start", start],
  ["bot_add", botAdd],
  ["bot_remove", botRemove],
  ["EntityInteraction", entityInteraction],
])
