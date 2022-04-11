/// <reference types="@cardsgame/types" />

type BattleResult = {
  outcome: string
  winner: string
  loser: string
}

interface WarMessage {
  battleResult: ServerMessage<BattleResult>
  gameOver: ServerMessage<{ winner: string }>
}
