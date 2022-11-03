import { Broadcast } from "./broadcast.js"
import { ChangeIdx } from "./changeIdx.js"
import { ChangeParent } from "./changeParent.js"
import { DealCards } from "./dealCards.js"
import { DrawOutUntil } from "./drawOutUntil.js"
import { GameOver } from "./gameOver.js"
import { NextRound } from "./nextRound.js"
import { Noop } from "./noop.js"
import { PlaceOnGrid } from "./placeOnGrid.js"
import { NextPlayer, PreviousPlayer } from "./playerTurns.js"
import { Deselect, Select, ToggleSelection } from "./selectChild.js"
import { Sequence } from "./sequence.js"
import { ShuffleChildren } from "./shuffleChildren.js"
import { FaceDown, FaceUp, Flip } from "./twoSided.js"
import { HideUI, RevealUI } from "./ui.js"
import { Wait } from "./wait.js"

export * from "./broadcast.js"
export * from "./changeIdx.js"
export * from "./changeParent.js"
export * from "./dealCards.js"
export * from "./drawOutUntil.js"
export * from "./gameOver.js"
export * from "./nextRound.js"
export * from "./noop.js"
export * from "./placeOnGrid.js"
export * from "./playerTurns.js"
export * from "./selectChild.js"
export * from "./sequence.js"
export * from "./shuffleChildren.js"
export * from "./twoSided.js"
export * from "./ui.js"
export * from "./wait.js"

export const commands = {
  Broadcast,
  ChangeIdx,
  ChangeParent,
  DealCards,
  DrawOutUntil,
  GameOver,
  NextRound,
  Noop,
  PlaceOnGrid,
  NextPlayer,
  PreviousPlayer,
  Deselect,
  Select,
  ToggleSelection,
  Sequence,
  ShuffleChildren,
  FaceDown,
  FaceUp,
  Flip,
  HideUI,
  RevealUI,
  Wait,
}
