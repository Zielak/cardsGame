import { Player } from "../src/player"
import { OwnableParent, OwnableEntity } from "./helpers/ownableEntities"
import { State } from "../src/state"
import { hasOwnership } from "../src/traits"
import { DumbParent, DumbEntity } from "./helpers/dumbEntities"
import { LabeledEntity, LabeledParent } from "./helpers/labeledEntities"
import { SmartParent, SmartEntity } from "./helpers/smartEntities"

let player: Player
let state: State

beforeEach(() => {
  player = new Player({ clientID: "myID" })
  state = new State({
    hostID: "asd"
  })
})

describe(`entity properties`, () => {
  test(`owner points to correct player`, () => {
    const entity = new OwnableEntity(state, { owner: player })

    expect(entity.owner)
  })
})

describe(`getOwner`, () => {
  test(`entity's direct owner`, () => {
    let parent = new OwnableParent(state)
    let entity = new OwnableEntity(state, { owner: player })

    expect(entity.getOwner()).toBe(player)
  })
  test(`root entity, no owner`, () => {
    let parent = new OwnableParent(state)
    let entity = new OwnableEntity(state, { parent })

    expect(entity.getOwner()).toBe(undefined)
  })
  test(`entity parent's owner`, () => {
    let parent = new OwnableParent(state, { owner: player })
    let entity = new OwnableEntity(state, { parent })

    expect(entity.getOwner()).toBe(player)
  })
})

describe(`hasOwnership`, () => {
  it(`correctly detects ownership trait`, () => {
    const parent = new OwnableParent(state)
    const entity = new OwnableEntity(state, { parent })
    const smartParent = new SmartParent(state)
    const smartEntity = new SmartEntity(state)

    expect(hasOwnership(parent)).toBe(true)
    expect(hasOwnership(entity)).toBe(true)
    expect(hasOwnership(smartParent)).toBe(true)
    expect(hasOwnership(smartEntity)).toBe(true)
  })

  it(`returns false for entities without ownership trait`, () => {
    const dumbParent = new DumbParent(state)
    const dumbEntity = new DumbEntity(state)
    const labeledEntity = new LabeledEntity(state)
    const labeledParent = new LabeledParent(state)

    expect(hasOwnership(dumbParent)).toBe(false)
    expect(hasOwnership(dumbEntity)).toBe(false)
    expect(hasOwnership(labeledEntity)).toBe(false)
    expect(hasOwnership(labeledParent)).toBe(false)
  })
})
