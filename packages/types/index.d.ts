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
  // EntityInteraction or any other Game-related command
  command?: string

  // Interaction-related events ("click")
  event?: string

  // Path to target Entity, by idx/idx/idx...
  entityPath?: number[]

  // custom command's data
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

// 1 Transform the type to flag all the undesired keys as 'never'
type FlagExcludedType<Base, Type> = {
  [Key in keyof Base]: Base[Key] extends Type ? never : Key
}

// 2 Get the keys that are not flagged as 'never'
type AllowedNames<Base, Type> = FlagExcludedType<Base, Type>[keyof Base]

// 3 Use this with a simple Pick to get the right interface, excluding the undesired type
type OmitType<Base, Type> = Pick<Base, AllowedNames<Base, Type>>

// 4 Exclude the Function type to only get properties
type ConstructorType<T> = OmitType<T, Function>
