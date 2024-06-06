type PlayersCount = {
  min: number
  max: number
  bots?: {
    min: number
    max: number
  }
}

/**
 * Type straight from colyseus.js, only because it was incorrectly exported.
 */
interface colRoomAvailable<Metadata = any> {
  roomId: string
  clients: number
  maxClients: number
  metadata?: Metadata
}
interface RoomAvailable<T = any> extends colRoomAvailable<T> {
  name: string
}
