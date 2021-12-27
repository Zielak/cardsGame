import * as commands from "./commands"

export { LobbyRoom, Server } from "@colyseus/core"
export { WebSocketTransport } from "@colyseus/ws-transport"
export type { RoomConstructor } from "@colyseus/core/build/Room"
export { Schema, ArraySchema, MapSchema } from "@colyseus/schema"

export { canBeChild } from "./annotations/canBeChild"
export { containsChildren } from "./annotations/containsChildren"
export { defineTypes, type } from "./annotations/type"

export * from "./bots/botNeuron"

export { commands }

export * from "./command"

export * from "./room"
export * from "./state"
export * from "./state/helpers"

export * from "./actionTemplate"

export { Conditions } from "./conditions"
export { getFlag, setFlag } from "./conditions/utils"
export { BotConditions, EntityConditions } from "./bots/conditions"
export { ClientMessageConditions } from "./interaction"

export { testAction } from "./interaction"

export { Player, ServerPlayerMessage } from "./players/player"
export { Bot } from "./players/bot"

export * from "./traits/boxModel"
export * from "./traits/child"
export * from "./traits/entity"
export * from "./traits/flexyContainer"
export * from "./traits/identity"
export * from "./traits/label"
export * from "./traits/location"
export * from "./traits/ownership"
export * from "./traits/parent"
export * from "./traits/parentArray"
export * from "./traits/parentMap"
export * from "./traits/selectableChildren"
export * from "./traits/twoSided"

export * from "./entities"

export { populatePlayerEvent } from "./utils/populatePlayerEvent"
