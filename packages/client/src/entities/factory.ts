import { EntityView } from "./entityView"
import { ClassicCardView } from "./classicCardView"
import { DeckView } from "./deckView"
import { PileView } from "./pileView"
import { PlayerView } from "./playerView"
import { HandView } from "./handView"
import { ContainerView } from "./containerView"

export const entityFactory = (data: ClientEntityData) => {
  const factories: {
    [key: string]: typeof EntityView
  } = {
    player: PlayerView,
    classicCard: ClassicCardView,
    deck: DeckView,
    hand: HandView,
    pile: PileView,
    container: ContainerView
  }
  return factories[data.type]
    ? new factories[data.type](data)
    : new EntityView(data)
}
