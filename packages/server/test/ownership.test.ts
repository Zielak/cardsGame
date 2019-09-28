import { Player } from "../src/player"
import { DumbParent } from "./helpers/dumbParent"
import { State } from "../src/state"
import { DumbEntity } from "./helpers/dumbEntity"
import { getOwner } from "../src/traits/ownership"

let state: State

beforeEach(() => {
  state = new State({
    minClients: 1,
    maxClients: 4,
    hostID: "asd"
  })
})

describe(`getOwner`, () => {
  let player: Player
  beforeEach(() => {
    player = new Player({ clientID: "myID" })
  })

  test(`entity's direct owner`, () => {
    let parent = new DumbParent(state)
    let entity = new DumbEntity(state, { owner: player, parent })

    expect(getOwner(state, entity)).toBe(player)
  })
  test(`root entity, no owner`, () => {
    let parent = new DumbParent(state)
    let entity = new DumbEntity(state, { parent })

    expect(getOwner(state, entity)).toBe(undefined)
  })
  test(`entity parent's owner`, () => {
    let parent = new DumbParent(state, { owner: player })
    let entity = new DumbEntity(state, { parent })

    expect(getOwner(state, entity)).toBe(player)
  })
})
