import { RoomAvailable as colRoomAvailable } from "colyseus.js/lib/Room"

export interface RoomAvailable<T = any> extends colRoomAvailable<T> {
  name: string
}
export * from "./game"
export * from "./lobbyRoom"
export * from "./room"
export * from "./schema"
