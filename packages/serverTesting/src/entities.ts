import {
  ClassicCard,
  Container,
  Deck,
  Grid,
  Hand,
  Line,
  Pile,
  Spread,
} from "@cardsgame/server"

import type { EntityConstructor } from "./types"

export const defaultEntities: Record<string, EntityConstructor> = {
  classicCard: ClassicCard,
  container: Container,
  deck: Deck,
  grid: Grid,
  hand: Hand,
  line: Line,
  pile: Pile,
  spread: Spread,
}
