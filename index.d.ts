declare const TopTypesON: boolean

/**
 * Interactions & Actions
 */
export type InteractionDefinition = {
  eventType?: string
  name?: string | string[]
  type?: string | string[]
  value?: number | number[]
  rank?: string | string[]
  suit?: string | string[]
}
