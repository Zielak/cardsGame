import { Grid } from "../../src/entities/grid"
import { State } from "../../src/state/state"
import { DumbEntity } from "../helpers/dumbEntities"

let state: State

beforeEach(() => {
  state = new State()
})

describe("#addChildAt", () => {
  test("4x4", () => {
    const grid = new Grid(state, { columns: 4, rows: 4 })
    let entity: DumbEntity

    entity = new DumbEntity(state)
    grid.addChildAt(entity, 0, 0)
    expect(entity.idx).toBe(0)

    entity = new DumbEntity(state)
    grid.addChildAt(entity, 3, 0)
    expect(entity.idx).toBe(3)

    entity = new DumbEntity(state)
    grid.addChildAt(entity, 0, 1)
    expect(entity.idx).toBe(4)

    entity = new DumbEntity(state)
    grid.addChildAt(entity, 1, 1)
    expect(entity.idx).toBe(5)

    entity = new DumbEntity(state)
    grid.addChildAt(entity, 3, 3)
    expect(entity.idx).toBe(15)
  })
})
