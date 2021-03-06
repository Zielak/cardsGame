import { Room as colyseusRoom } from "colyseus.js/lib/Room"

import { logs } from "@cardsgame/utils"

import { RoomAvailable } from "./"

export class LobbyRoom {
  onInit: (rooms: RoomAvailable[]) => void
  onAdd: (room: RoomAvailable) => void
  onRemove: (roomId: string) => void

  constructor(public room: colyseusRoom) {
    room.onMessage<RoomAvailable[]>("rooms", (rooms) => {
      this.onInit(rooms)
      logs.verbose("Lobby", "init", rooms)
    })

    room.onMessage<[string, RoomAvailable]>("+", ([roomId, room]) => {
      this.onAdd(room)
      logs.verbose("Lobby", "++", room.name, roomId)
    })

    room.onMessage<string>("-", (roomId) => {
      this.onRemove(roomId)
      logs.verbose("Lobby", "--", roomId)
    })

    room.onLeave((code) => {
      logs.notice("Lobby", "leaving", code)
    })
    room.onError((code, message) => {
      logs.error("Lobby", `oops, error ocurred: [${code}]`, message)
    })

    logs.notice("Lobby", "joined")
  }
}
