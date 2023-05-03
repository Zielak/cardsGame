/// <reference types="@cardsgame/types" />

type BattleResult = {
  outcome?: string
  winner?: string
  loser?: string
}

type WarMessageTypes = {
  battleResult: BattleResult
  gameOver: { winner: string }
}
