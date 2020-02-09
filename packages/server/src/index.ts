export { Server } from "colyseus"
export { defineTypes, Schema, ArraySchema, MapSchema } from "@colyseus/schema"

// TODO: wrap `defineTypes` for our `types`!!!
export { type, canBeChild, containsChildren } from "./annotations"

import * as commands from "./commands"
export { commands }

export * from "./command"

export * from "./room"
export * from "./state"

export * from "./conditions/conditions"
export * from "./actionTemplate"
export * from "./player"

// export * from "./traits"
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

// Useful for testing

export * from "./utils"
