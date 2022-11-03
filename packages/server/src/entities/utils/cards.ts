import { logs } from "@cardsgame/utils"

import type { ClassicCard } from "../classicCard.js"

// prettier-ignore
export const ALL_CARD_RANKS = new Set([
  "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"
])

export const ALL_CARD_SUITS = new Set(["D", "S", "H", "C"])

/**
 * Will generate an array of card options.
 * Use this array to create actual cards yourself
 * @example
 * ```ts
 * standardDeckFactory().map(options => {
 *   new ClassicCard({state, ...options})
 * })
 * ```
 *
 * @param ranks array of desired ranks
 * @param suits array of desired suits
 */
export const standardDeckFactory = (
  // prettier-ignore
  ranks: string[] | Set<string> = ALL_CARD_RANKS,
  suits: string[] | Set<string> = ALL_CARD_SUITS
): Pick<ClassicCard, "rank" | "suit">[] => {
  const cards: Pick<ClassicCard, "rank" | "suit">[] = []

  for (const suit of suits) {
    for (const rank of ranks) {
      cards.push({ suit, rank })
    }
  }

  logs.log(`created data for a deck of ${cards.length} cards`)

  return cards
}
