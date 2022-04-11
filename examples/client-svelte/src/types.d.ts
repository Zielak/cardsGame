type WarState = {
  isAtWar: boolean
  playersPlayed: Map<string, boolean>
  ante: number
}

type CardData = {
  rank: string
  suit: string
  faceUp: boolean
}

type PlayerData = {
  connected: boolean
  played: boolean
  idx: number // container's idx
  deckCount: number
  pile: Map<string, CardData>
}
