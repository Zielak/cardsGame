declare const ClientTypesON: boolean

type PlayerEvent = {
  // most likely 'click'
  type: string
  // Path to target object, by idx/idx/idx...
  targetPath?: number[]
  // additional/optional data
  data?: any
}

interface EntityData {
  id: number
  idx: number
  children?: {
    [key: number]: EntityData
  }
  parent?: EntityID
  x: number
  y: number
  angle: number
  width: number
  height: number
  name: string
  type: string

  faceUp?: boolean
  marked?: boolean
  suit?: string
  rank?: string
  rotated?: number
  selected?: boolean

  limits?: {
    minAngle: number
    maxAngle: number
    minX: number
    maxX: number
    minY: number
    maxY: number
  }

  visibleToPublic: boolean
}

interface ClientEntityData extends EntityData {
  visibleToClient: boolean
}
