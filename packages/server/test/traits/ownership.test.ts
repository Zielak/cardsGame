import { Player } from "../../src/player"
import { OwnableParent, OwnableEntity } from "../helpers/ownableEntities"
import { State } from "../../src/state"
import { hasOwnership } from "../../src/traits/ownership"
import { DumbArrayParent, DumbEntity } from "../helpers/dumbEntities"
import { LabeledEntity, LabeledParent } from "../helpers/labeledEntities"
import { SmartParent, SmartEntity } from "../helpers/smartEntities"

let player: Player
let state: State

beforeEach(() => {
  player = new Player({ clientID: "myID" })
  state = new State()
})

describe(`entity properties`, () => {
  test(`owner points to correct player`, () => {
    const entity = new OwnableEntity(state, { owner: player })

    expect(entity.owner).toBe(player)
  })
})

describe(`owner getter`, () => {
  let entity: OwnableEntity
  let parent: OwnableParent
  test(`entity's direct owner`, () => {
    entity = new OwnableEntity(state, { owner: player })

    expect(entity.owner).toBe(player)
  })
  test(`root entity, no owner`, () => {
    parent = new OwnableParent(state)
    entity = new OwnableEntity(state, { parent })

    expect(entity.owner).toBe(undefined)
  })
  test(`entity parent's owner`, () => {
    parent = new OwnableParent(state, { owner: player })
    entity = new OwnableEntity(state, { parent })

    expect(entity.owner).toBe(player)
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
    const dumbParent = new DumbArrayParent(state)
    const dumbEntity = new DumbEntity(state)
    const labeledEntity = new LabeledEntity(state)
    const labeledParent = new LabeledParent(state)

    expect(hasOwnership(dumbParent)).toBe(false)
    expect(hasOwnership(dumbEntity)).toBe(false)
    expect(hasOwnership(labeledEntity)).toBe(false)
    expect(hasOwnership(labeledParent)).toBe(false)
  })
})
