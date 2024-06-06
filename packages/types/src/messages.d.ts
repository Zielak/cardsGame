/**
 * Event types coming from client ot server
 */
type ClientMessageTypes = {
  start: { variantData: Record<string, unknown> }
  kick: { id: string }
  bot_add: { intelligence: number }
  bot_remove: { id: string }
  EntityInteraction: RawInteractionClientPlayerMessage
}

/**
 * Event types coming from server to client
 */
interface ServerMessageTypes {
  gameInfo: ServerMessage<string>
  gameWarn: ServerMessage<string>
  gameError: ServerMessage<string>

  gameFinished: ServerMessage<void>

  dragStatus: ServerMessage<{
    interaction: "dragstart" | "dragend"
    idxPath: string
    status: boolean
  }>
}

type RecordOfServerMessages<R extends Record<string, unknown>> = {
  [key in keyof R]: ServerMessage<R[key]>
}
type AllServerMessageTypes<MoreMessageTypes extends Record<string, unknown>> =
  ServerMessageTypes & MoreMessageTypes

/**
 * Message sent by server, either directly to one client
 * or broadcast to all.
 */
type ServerMessage<D = unknown> = {
  data?: D

  /**
   * Broadcasts sent by undoing a command will be marked with `undo: true`.
   * Use it however you need on client-side.
   */
  undo?: boolean
}

/**
 * The only valuable interaction event types.
 * - `tap` - touch down&up, or click by mouse
 * - `dragstart` - touch/mouse down + started moving pointer away
 * - `dragend` - released touch/mouse, after dragging
 */
type InteractionType = "tap" | "dragstart" | "dragend"

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
   * The only valuable interaction event types.
   * - `tap` - touch down&up, or click by mouse
   * - `dragstart` - touch/mouse down + started moving pointer away
   * - `dragend` - released touch/mouse, after dragging
   */
  interaction?: InteractionType
  /**
   * Path to target Entity as an array
   *
   * @example
   * [0,2,0]
   */
  entityPath?: number[]
}

type ClientPlayerMessage = RawInteractionClientPlayerMessage & {
  /**
   * Either "EntityInteraction" or game's custom command
   */
  messageType: string
}
