import { DumbParent, DumbEntity } from "../../__test__/helpers/dumbEntities.js"
import {
  LabeledEntity,
  LabeledParent,
} from "../../__test__/helpers/labeledEntities.js"
import {
  OwnableEntity,
  OwnableParent,
} from "../../__test__/helpers/ownableEntities.js"
import {
  SmartEntity,
  SmartParent,
} from "../../__test__/helpers/smartEntities.js"
import { Player } from "../../player/player.js"
import { State } from "../../state/state.js"
import { hasOwnership } from "../ownership.js"

let player: Player
let player2: Player
let state: State
let entity: OwnableEntity
let parent: OwnableParent

beforeEach(() => {
  player = new Player({ clientID: "myID" })
  player2 = new Player({ clientID: "myID2" })
  state = new State()
})

describe("entity properties", () => {
  test("owner points to correct player", () => {
    entity = new OwnableEntity(state, { owner: player })

    expect(entity.owner).toBe(player)
    expect(player.hasEntityInMainFocus).toBe(false)
  })

  test("main focus updating when switching owner", () => {
    entity = new OwnableEntity(state, { owner: player, ownersMainFocus: true })

    expect(entity.owner).toBe(player)
    expect(entity.ownersMainFocus).toBe(true)

    expect(player.hasEntityInMainFocus).toBe(true)
    expect(player2.hasEntityInMainFocus).toBe(false)

    entity.owner = player2

    expect(entity.owner).toBe(player2)
    expect(entity.ownersMainFocus).toBe(true)

    expect(player.hasEntityInMainFocus).toBe(false)
    expect(player2.hasEntityInMainFocus).toBe(true)

    entity.owner = undefined

    expect(entity.owner).toBe(undefined)
    expect(entity.ownersMainFocus).toBe(true)

    expect(player.hasEntityInMainFocus).toBe(false)
    expect(player2.hasEntityInMainFocus).toBe(false)
  })

  test("changing ownersMainFocus on runtime", () => {
    entity = new OwnableEntity(state, { owner: player })

    expect(player.hasEntityInMainFocus).toBe(false)
    expect(player2.hasEntityInMainFocus).toBe(false)

    entity.ownersMainFocus = true

    expect(player.hasEntityInMainFocus).toBe(true)
    expect(player2.hasEntityInMainFocus).toBe(false)

    entity.owner = player

    expect(player.hasEntityInMainFocus).toBe(true)
    expect(player2.hasEntityInMainFocus).toBe(false)

    entity.ownersMainFocus = false

    expect(player.hasEntityInMainFocus).toBe(false)
    expect(player2.hasEntityInMainFocus).toBe(false)
  })
})

describe("owner getter", () => {
  test("entity's direct owner", () => {
    entity = new OwnableEntity(state, { owner: player })

    expect(entity.owner).toBe(player)
  })
  test("root entity, no owner", () => {
    parent = new OwnableParent(state)
    entity = new OwnableEntity(state, { parent })

    expect(entity.owner).toBe(undefined)
  })
  test("entity parent's owner", () => {
    parent = new OwnableParent(state, { owner: player })
    entity = new OwnableEntity(state, { parent })

    expect(entity.owner).toBe(player)
  })
})

describe("hasOwnership", () => {
  it("correctly detects ownership trait", () => {
    parent = new OwnableParent(state)
    entity = new OwnableEntity(state, { parent })

    const smartParent = new SmartParent(state)
    const smartEntity = new SmartEntity(state)

    expect(hasOwnership(parent)).toBe(true)
    expect(hasOwnership(entity)).toBe(true)
    expect(hasOwnership(smartParent)).toBe(true)
    expect(hasOwnership(smartEntity)).toBe(true)
  })

  it("returns false for entities without ownership trait", () => {
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
