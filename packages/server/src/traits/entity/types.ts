import { State } from "@/state/state.js"

export const ENTITY_INTERNAL_KEY = "$cg$internal"
export interface ClassWithIED {
  [ENTITY_INTERNAL_KEY]: InternalEntityData
}
export type InternalEntityData = {
  traitsConstructors: ((state: State, options?: Record<string, any>) => void)[]
  hooks: Map<string, (() => void)[]>
  localPropDescriptor: Record<string, PropertyDescriptor>
}
