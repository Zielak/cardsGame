import type { RoomAvailable as colRoomAvailable } from "colyseus.js/lib/Room"

export interface RoomAvailable<T = any> extends colRoomAvailable<T> {
  name: string
}
export * from "./game"
export * from "./lobbyRoom"
export * from "./room"
export * from "./schema/types"
export * from "./schema/schema"
export { makeChildrenCollection } from "./schema/children"
