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

/**
 * Event created by player on client
 * while interacting with game elements or UI
 */
type ClientPlayerEvent = {
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
   * Path to target Entity.
   * As array of numbers: `[0, 2, 0]`
   * Ar a string: `"0,2,0"` (no spaces)
   */
  entityPath?: number[] | string

  /**
   * Custom command's data.
   */
  data?: any
}

/**
 * Type of the element which player interacted with
 */
// type PlayerEventTargetType = "Entity" | "UIElement"

interface IPlayerViewPosition {
  alignX?: "left" | "center" | "right"
  alignY?: "top" | "middle" | "bottom"
  paddingX?: number
  paddingY?: number
}

// 1. Transform the type to flag all the undesired keys as 'never'
type FlagExcludedType<Base, Type> = {
  [Key in keyof Base]: Base[Key] extends Type ? never : Key
}

// 2. Get the keys that are not flagged as 'never'
type AllowedNames<Base, Type> = FlagExcludedType<Base, Type>[keyof Base]

// 3. Use this with a simple Pick to get the right interface, excluding the undesired type
type OmitType<Base, Type> = Pick<Base, AllowedNames<Base, Type>>

// 4. Exclude the Function type to only get properties
type ConstructorType<T> = OmitType<T, Function>
