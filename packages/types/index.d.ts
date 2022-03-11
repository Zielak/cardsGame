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
   *
   * TODO: Not yet used. Could be useful with drag&drop or swipe interaction
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
 * Player's entry in the game state
 */
interface IPlayerDefinition {
  clientID: string
  name: string
  score: number
  timeLeft: number
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

type IndexUpdate = {
  from: number
  to: number
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

type PrimitivePropertyNames<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [P in keyof T]: Exclude<T[P], undefined> extends object ? never : P
}[keyof T]

/**
 * Grabs type of array's items
 * @see https://stackoverflow.com/a/51399781
 */
type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never

type MapElement<MapType extends Map<any, unknown>> = MapType extends Map<
  any,
  infer ElementType
>
  ? ElementType
  : never
