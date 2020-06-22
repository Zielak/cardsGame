/**
 * Entity
 */

type EntityID = number

/**
 * Message sent by server, either directly to one client
 * or broadcast to all.
 */
type ServerMessage = {
  type: string
  data?: unknown // & PrivateAttributeChangeData

  /**
   * Broadcasts sent by undoing a command will be marked with `undo: true`.
   * Use it however you need on client-side.
   */
  undo?: boolean
}

// type PrivateAttributeChangeData = {
//   path: number[]
//   owner?: string
//   public: boolean
//   attribute: string
//   value: any
// }

type BasePlayerEvent = {
  /**
   * Defaults to `EntityInteraction` when sending via `room.sendInteraction()`.
   * May be any other Game-specific command.
   */
  command?: string
  /**
   * Interaction-related events ("click", "touchstart"...)
   */
  event?: string
  /**
   * Custom command's data.
   */
  data?: any
}

/**
 * Event created by player on client
 * while interacting with game elements or UI
 */
type ClientPlayerEvent = BasePlayerEvent & {
  /**
   * Path to target Entity as an array: `[0,2,0]`
   */
  entityPath?: number[]
}

type BotPlayerEvent = BasePlayerEvent & {
  /**
   * Which entity is supposed to be "clicked" by bot?
   * Pass direct reference to `Entity` object.
   */
  entity?: unknown
}

type PlayerInteractionCommand = { command: string }

/**
 * How to transform current player's containers/entities on client's screen.
 * Units are in pixels.
 */
interface IPlayerViewPosition {
  alignX?: "left" | "center" | "right"
  alignY?: "top" | "middle" | "bottom"
  paddingX?: number
  paddingY?: number
}

type AllowArrays<T> = { [prop in keyof T]: T[prop] | Array<T[prop]> }

// // 1. Transform the type to flag all the undesired keys as 'never'
// type FlagExcludedType<Base, Type> = {
//   [Key in keyof Base]: Base[Key] extends Type ? never : Key
// }

// // 2. Get the keys that are not flagged as 'never'
// type AllowedNames<Base, Type> = FlagExcludedType<Base, Type>[keyof Base]

// // 3. Use this with a simple Pick to get the right interface, excluding the undesired type
// type OmitType<Base, Type> = Pick<Base, AllowedNames<Base, Type>>

// // 4. Exclude the Function type to only get properties
// type ConstructorType<T> = OmitType<T, Function>

// Author: https://stackoverflow.com/a/55479659/1404284
type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K
}[keyof T]
type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>
