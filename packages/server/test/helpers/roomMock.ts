import { noop } from "@cardsgame/utils"

function RoomMock(state = {}): void {
  this.state = state

  this.broadcast = noop
  this.commandsManager = {
    execute: noop,
  }
  this.botRunner = {
    onRoundStart: noop,
    onAnyMessage: noop,
    onPlayerTurnStarted: noop,
  }

  this.onPlayerTurnEnded = jest.fn()
  this.onPlayerTurnStarted = jest.fn()
}

export { RoomMock }
