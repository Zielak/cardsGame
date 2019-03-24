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
 * Event created by player on client
 * while interacting with game elements
 */
type PlayerEvent = {
  // Interaction-related events ("click") OR any other custom, game-related command ("pass", "done", etc)
  event?: string

  // Path to target Entity, by idx/idx/idx...
  entityPath?: number[]

  // custom event's data
  data?: any
}

/**
 * Type of the element which player interacted with
 */
// type PlayerEventTargetType = "Entity" | "UIElement"
