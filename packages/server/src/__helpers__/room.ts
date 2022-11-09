import { noop } from "@cardsgame/utils"

import { defineRoom } from "../room/defineRoom.js"

const TestRoom = defineRoom("TestRoom", {
  onPlayerTurnEnded: jest.fn(),
  onPlayerTurnStarted: jest.fn(),
})
TestRoom.prototype.broadcast = noop
TestRoom.prototype.commandsManager = {
  execute: noop,
} as any
TestRoom.prototype.botRunner = {
  onRoundStart: noop,
  onAnyMessage: noop,
  onPlayerTurnStarted: noop,
} as any

export { TestRoom }
