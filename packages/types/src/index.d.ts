/// <reference path="cards.d.ts" />
/// <reference path="messages.d.ts" />
/// <reference path="utils.d.ts" />

interface RoomCreateOptions {
  [key: string]: unknown
  /**
   * Name of integration test to execute
   */
  test?: string
  /**
   * Hand picked values for the game's variant
   */
  variantData?: Record<string, unknown>
  /**
   * Name of the pre-defined variant preset, players wish to play
   */
  variantPreset?: string
}

/**
 * Player's entry in the game state
 */
interface PlayerDefinition {
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
