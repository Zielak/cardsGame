import { noop } from "@cardsgame/utils"

class Room {
  broadcast = noop
  commandsManager = {
    execute: noop,
  }
  botRunner = {
    onRoundStart: noop,
    onAnyMessage: noop,
    onPlayerTurnStarted: noop,
  }

  onPlayerTurnEnded = jest.fn()
  onPlayerTurnStarted = jest.fn()
}

export { Room }
