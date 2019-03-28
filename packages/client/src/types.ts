import { DataChange } from "@colyseus/schema"

export interface EntityData {
  onAdd?: (entity: EntityData, key: number) => void
  onRemove?: (entity: EntityData, key: number) => void
  onChange?: (change: DataChange[]) => void
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

export interface ClientEntityData extends EntityData {
  visibleToClient: boolean
}

export type AttributeChangeData = {
  name: string
  value: any
}
