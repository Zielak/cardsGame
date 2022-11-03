import { decimal } from "@cardsgame/utils"

import type { Bot } from "../player/bot.js"
import type { ChildTrait } from "../traits/child.js"

const STUPIDITY_RANGE = 50

export type EntitySubject = { entity: ChildTrait }

export const botsValueError = (bot: Bot): number => {
  if (bot.intelligence === 0) {
    return Math.random() * 1000 - 500
  }

  return decimal(
    (Math.random() * STUPIDITY_RANGE - STUPIDITY_RANGE / 2) *
      (1 - bot.intelligence)
  )
}
