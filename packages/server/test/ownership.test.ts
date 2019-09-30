import { Player } from "../src/player"
import { OwnableParent, OwnableEntity } from "./helpers/ownableEntities"
import { State } from "../src/state"

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
    let parent = new OwnableParent(state)
    let entity = new OwnableEntity(state, { owner: player, parent })

    expect(entity.getOwner(state)).toBe(player)
  })
  test(`root entity, no owner`, () => {
    let parent = new OwnableParent(state)
    let entity = new OwnableEntity(state, { parent })

    expect(entity.getOwner(state)).toBe(undefined)
  })
  test(`entity parent's owner`, () => {
    let parent = new OwnableParent(state, { owner: player })
    let entity = new OwnableEntity(state, { parent })

    expect(entity.getOwner(state)).toBe(player)
  })
})
