export declare const EntityEvents: {
  childAdded: string
  childRemoved: string
  ownerUpdate: string
  parentUpdate: string
  idxUpdate: string
  privateSetter: string
  privateAttributeChange: string
  sendPropToOwner: string
  sendPropToEveryone: string
  selectedByPlayer: string
}
export declare const StateEvents: {
  privatePropsSyncRequest: string
}
export declare type EntityTransformData = {
  x?: number
  y?: number
  angle?: number
}
