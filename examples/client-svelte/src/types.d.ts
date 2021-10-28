type WarState = {
  isAtWar: boolean
  playersPlayed: boolean[]
  ante: number
}

type WarMessage = {
  outcome: string
  winner: string
  loser: string
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
