/**
 * Entity
 */

type EntityID = number

/**
 * Client-server interacton
 */

/**
 * Message sent by server, usually containing
 * private entity props (state filtering)
 */
type ServerMessage = {
  event: string
  data?: unknown & PrivateAttributeChangeData
}

type PrivateAttributeChangeData = {
  path: number[]
  owner?: string
  public: boolean
  attribute: string
  value: any
}

/**
 * Event created by player
 * while interacting with game elements
 */
type PlayerEvent = {
  eventType?: string
  targetType: PlayerEventTargetType
  // Path to target Entity, by idx/idx/idx...
  targetPath?: number[]
  // additional/optional data
  data?: any
}

/**
 * Type of the element which player interacted with
 */
type PlayerEventTargetType = "Entity" | "UIButton"
