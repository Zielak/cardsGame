import { logs } from "@cardsgame/utils"
import { Room as colyseusRoom } from "colyseus.js/lib/Room"

import type { RoomAvailable } from "."

export class LobbyRoom {
  onInit: (rooms: RoomAvailable[]) => void
  onAdd: (room: RoomAvailable) => void
  onRemove: (roomId: string) => void

  constructor(public room: colyseusRoom) {
    room.onMessage<RoomAvailable[]>("rooms", (rooms) => {
      this.onInit(rooms)
    })

    room.onMessage<[string, RoomAvailable]>("+", ([roomId, room]) => {
      this.onAdd(room)
    })

    room.onMessage<string>("-", (roomId) => {
      this.onRemove(roomId)
    })

    room.onLeave((code) => {
      logs.log("Lobby", "leaving", code)
    })
    room.onError((code, message) => {
      logs.error("Lobby", `oops, error ocurred: [${code}]`, message)
    })

    logs.log("Lobby", "joined")
  }
}
