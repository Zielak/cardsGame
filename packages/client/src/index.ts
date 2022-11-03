import type { RoomAvailable as colRoomAvailable } from "colyseus.js"

export interface RoomAvailable<T = any> extends colRoomAvailable<T> {
  name: string
}
export * from "./game.js"
export * from "./lobbyRoom.js"
export * from "./room.js"

export * from "./schema/index.js"
