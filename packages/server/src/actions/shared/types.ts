import type { Player } from "../../player/player.js"
import type { QuerableProps } from "../../queries/types.js"

export type InteractionQueries = (player: Player) => QuerableProps[] | "*"
