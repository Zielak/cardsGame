/// <reference types="@cardsgame/types" />

type BattleResult = {
  outcome: string
  winner: string
  loser: string
}

type WarMessage = {
  battleResult: BattleResult
  gameOver: { winner: string }
}
