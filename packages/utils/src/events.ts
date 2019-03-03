export const EntityEvents = {
  childAdded: "childAdded",
  childRemoved: "childRemoved",
  ownerUpdate: "ownerUpdate",
  parentUpdate: "parentUpdate",
  idxUpdate: "idxUpdate",

  privateSetter: "privateSetter",
  privateAttributeChange: "privateAttributeChange",

  sendPropToOwner: "sendPropToOwner",
  sendPropToEveryone: "sendPropToEveryone",

  selectedByPlayer: "selectedByPlayer"
}

export const StateEvents = {
  privatePropsSyncRequest: "privatePropsSyncRequest"
}

export type EntityTransformData = {
  x?: number
  y?: number
  angle?: number
}
