/**
 * Message sent by server, either directly to one client
 * or broadcast to all.
 */
type ServerMessage = {
  data?: unknown

  /**
   * Broadcasts sent by undoing a command will be marked with `undo: true`.
   * Use it however you need on client-side.
   */
  undo?: boolean
}

/**
 * First point of entry has this type.
 * With Colyseus lib `messageType` comes separately.
 */
type RawInteractionClientPlayerMessage = {
  /**
   * Custom command's data.
   */
  data?: unknown
  /**
   * Interaction-related events ("click", "touchstart"...)
   */
  event?: string
  /**
   * Path to target Entity as an array: `[0,2,0]`
   */
  entityPath?: number[]
}

type ClientPlayerMessage = RawInteractionClientPlayerMessage & {
  /**
   * Either "EntityInteraction" or game's custom command
   */
  messageType: string
}

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

// === Utility types ===

interface AnyClass extends Function {
  new (...args: any[]): any
}

type AllowArrays<T> = { [prop in keyof T]: T[prop] | Array<T[prop]> }

// Author: https://stackoverflow.com/a/55479659/1404284
type NonFunctionPropertyNames<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T]: T[K] extends Function ? never : K
}[keyof T]
type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>
