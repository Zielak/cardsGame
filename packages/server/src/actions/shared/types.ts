import type { Player } from "../../player/player.js"
import type { QuerableProps } from "../../queries/types.js"

/**
 * Only "*" is accepted as string.
 */
export type InteractionQueries = (player: Player) => QuerableProps[] | string
