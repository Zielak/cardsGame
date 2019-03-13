import { EntityView } from "./entityView"
import { ClassicCardView } from "./classicCardView"
import { DeckView } from "./deckView"
import { PileView } from "./pileView"
import { PlayerView } from "./playerView"
import { HandView } from "./handView"
import { ContainerView } from "./containerView"
import { ClientEntityData } from "../types"
import { RowView } from "./rowView"

export const entityFactory = (data: ClientEntityData) => {
  const factories: {
    [key: string]: typeof EntityView
  } = {
    classicCard: ClassicCardView,
    container: ContainerView,
    deck: DeckView,
    hand: HandView,
    pile: PileView,
    player: PlayerView,
    row: RowView
  }
  return factories[data.type]
    ? new factories[data.type](data)
    : new EntityView(data)
}
