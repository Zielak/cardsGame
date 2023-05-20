import { noop } from "@cardsgame/utils"

import { defineRoom } from "../room/defineRoom.js"
import { State } from "../state/state.js"

const TestRoom = defineRoom("TestRoom", {
  stateConstructor: State,
  onPlayerTurnEnded: jest.fn(),
  onPlayerTurnStarted: jest.fn(),
})
TestRoom.prototype.broadcast = noop
TestRoom.prototype.commandsManager = {
  execute: noop,
  undoLastCommand: jest.fn(),
} as any
TestRoom.prototype.botRunner = {
  onRoundStart: noop,
  onAnyMessage: noop,
  onPlayerTurnStarted: noop,
} as any

export { TestRoom }
