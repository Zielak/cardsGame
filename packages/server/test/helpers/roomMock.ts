import { noop } from "@cardsgame/utils"

function RoomMock() {
  this.broadcast = noop
  this.commandsManager = {
    execute: noop
  }
}

export { RoomMock }
