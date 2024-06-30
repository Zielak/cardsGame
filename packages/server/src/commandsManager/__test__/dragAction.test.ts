import {
  LabeledEntity,
  LabeledParent,
} from "__test__/helpers/labeledEntities.js"
import { TestRoom } from "__test__/helpers/room.js"

import {
  DragActionDefinition,
  defineDragAction,
} from "@/actions/drag/dragAction.js"
import { Noop } from "@/commands/noop.js"
import { ENTITY_INTERACTION } from "@/interaction/constants.js"
import { Player } from "@/player/player.js"
import type { ServerPlayerMessage } from "@/player/serverPlayerMessage.js"
import type { Room } from "@/room/base.js"
import { State } from "@/state/state.js"
import { populatePlayerEvent } from "@/utils/populatePlayerEvent.js"

import { CommandsManager } from "../commandsManager.js"

jest.mock("@/player/player.js")
jest.mock("@/commands/message.js")

let state: State
let event: ServerPlayerMessage
let room: Room<State>
let manager: CommandsManager<State>
let player: Player

const clientID = "PLAYER"
const conditions = () => {}
const command = () => new Noop()

beforeEach(() => {
  player = new Player({ clientID })
})

describe("drag action is kept in pending", () => {
  let dragAnyToPile: DragActionDefinition<State>
  let dragAnyToLine: DragActionDefinition<State>

  let fromEntity: LabeledEntity
  let toPile: LabeledParent
  let toLine: LabeledParent

  beforeEach(() => {
    dragAnyToPile = defineDragAction<State>({
      name: "AnyToPile",
      start: { interaction: () => "*", conditions, command },
      end: { interaction: () => [{ type: "pile" }], conditions, command },
    })
    jest.spyOn(dragAnyToPile.start, "getCommand")
    jest.spyOn(dragAnyToPile.end[0], "getCommand")
    dragAnyToLine = defineDragAction<State>({
      name: "OnlyHandToLine",
      start: { interaction: () => "*", conditions, command },
      end: { interaction: () => [{ type: "line" }], conditions, command },
    })
    jest.spyOn(dragAnyToLine.start, "getCommand")
    jest.spyOn(dragAnyToLine.end[0], "getCommand")

    state = new State()
    room = new TestRoom()
    room.possibleActions = [dragAnyToPile, dragAnyToLine]
    room.state = state
    manager = new CommandsManager(room)
    room.commandsManager = manager
    state.players.push(player)

    fromEntity = new LabeledEntity(state, { type: "classicCard" })
    toPile = new LabeledParent(state, { type: "pile" })
    toLine = new LabeledParent(state, { type: "line" })

    player.dragStartEntity = fromEntity
  })

  it("starts with A, ends with A", async () => {
    await expect(
      manager.handlePlayerEvent(
        populatePlayerEvent(
          state,
          {
            messageType: ENTITY_INTERACTION,
            entityPath: fromEntity.idxPath,
            interaction: "dragstart",
          },
          player.clientID,
        ),
      ),
    ).resolves.toBe(true)

    expect(dragAnyToPile.start.getCommand).toHaveBeenCalled()
    expect(dragAnyToLine.start.getCommand).not.toHaveBeenCalled()

    expect(manager.pendingActions.get(clientID).action).toBe(dragAnyToPile)

    await expect(
      manager.handlePlayerEvent(
        populatePlayerEvent(
          state,
          {
            messageType: ENTITY_INTERACTION,
            entityPath: toPile.idxPath,
            interaction: "dragend",
          },
          player.clientID,
        ),
      ),
    ).resolves.toBe(true)

    expect(manager.pendingActions.get(clientID)).toBeUndefined()

    expect(dragAnyToPile.end[0].getCommand).toHaveBeenCalled()
    expect(dragAnyToLine.end[0].getCommand).not.toHaveBeenCalled()
  })

  it("starts with A, and tries to end with B", async () => {
    await expect(
      manager.handlePlayerEvent(
        populatePlayerEvent(
          state,
          {
            messageType: ENTITY_INTERACTION,
            entityPath: fromEntity.idxPath,
            interaction: "dragstart",
          },
          player.clientID,
        ),
      ),
    ).resolves.toBe(true)

    expect(dragAnyToPile.start.getCommand).toHaveBeenCalled()
    expect(dragAnyToLine.start.getCommand).not.toHaveBeenCalled()

    expect(manager.pendingActions.get(clientID).action).toBe(dragAnyToPile)

    await expect(
      manager.handlePlayerEvent(
        populatePlayerEvent(
          state,
          {
            messageType: ENTITY_INTERACTION,
            entityPath: toLine.idxPath,
            interaction: "dragend",
          },
          player.clientID,
        ),
      ),
    ).rejects.toThrow()

    expect(dragAnyToPile.end[0].getCommand).not.toHaveBeenCalled()
    expect(dragAnyToLine.end[0].getCommand).not.toHaveBeenCalled()

    expect(manager.pendingActions.get(clientID)).toBeUndefined()
  })
})

describe("start on one action and end in another shouldn't be allowed", () => {
  let dragHandToHand: DragActionDefinition<State>
  let dragLineToLine: DragActionDefinition<State>

  let fromHand: LabeledEntity
  let parentHand: LabeledParent
  let toHand: LabeledParent
  let toLine: LabeledParent

  beforeEach(() => {
    dragHandToHand = defineDragAction<State>({
      name: "OnlyHandToHand",
      start: {
        interaction: () => [{ parent: { type: "hand" } }],
        conditions,
        command,
      },
      end: { interaction: () => [{ type: "hand" }], conditions, command },
    })
    jest.spyOn(dragHandToHand.start, "getCommand")
    jest.spyOn(dragHandToHand.end[0], "getCommand")

    dragLineToLine = defineDragAction<State>({
      name: "OnlyLineToLine",
      start: {
        interaction: () => [{ parent: { type: "line" } }],
        conditions,
        command,
      },
      end: { interaction: () => [{ type: "line" }], conditions, command },
    })
    jest.spyOn(dragLineToLine.start, "getCommand")
    jest.spyOn(dragLineToLine.end[0], "getCommand")

    state = new State()
    room = new TestRoom()
    room.possibleActions = [dragHandToHand, dragLineToLine]
    room.state = state
    manager = new CommandsManager(room)
    room.commandsManager = manager
    state.players.push(player)

    parentHand = new LabeledParent(state, { type: "hand" })
    fromHand = new LabeledEntity(state, {
      type: "classicCard",
      parent: parentHand,
    })

    toHand = new LabeledParent(state, { type: "hand" })
    toLine = new LabeledParent(state, { type: "line" })

    player.dragStartEntity = fromHand
  })

  it("allows drag from A to A", async () => {
    event = populatePlayerEvent(
      state,
      {
        messageType: ENTITY_INTERACTION,
        entityPath: fromHand.idxPath,
        interaction: "dragstart",
      },
      player.clientID,
    )

    await expect(manager.handlePlayerEvent(event)).resolves.toBe(true)

    expect(dragHandToHand.start.getCommand).toHaveBeenCalled()
    expect(dragLineToLine.start.getCommand).not.toHaveBeenCalled()

    expect(manager.pendingActions.get(clientID).action).toBe(dragHandToHand)

    await expect(
      manager.handlePlayerEvent(
        populatePlayerEvent(
          state,
          {
            messageType: ENTITY_INTERACTION,
            entityPath: toHand.idxPath,
            interaction: "dragend",
          },
          player.clientID,
        ),
      ),
    ).resolves.toBe(true)

    expect(dragHandToHand.end[0].getCommand).toHaveBeenCalled()
    expect(dragLineToLine.end[0].getCommand).not.toHaveBeenCalled()

    expect(manager.pendingActions.get(clientID)).toBeUndefined()
  })

  it("doesnt allow start of A to end with B", async () => {
    await expect(
      manager.handlePlayerEvent(
        populatePlayerEvent(
          state,
          {
            messageType: ENTITY_INTERACTION,
            entityPath: fromHand.idxPath,
            interaction: "dragstart",
          },
          player.clientID,
        ),
      ),
    ).resolves.toBe(true)

    expect(dragHandToHand.start.getCommand).toHaveBeenCalled()
    expect(dragLineToLine.start.getCommand).not.toHaveBeenCalled()

    await expect(
      manager.handlePlayerEvent(
        populatePlayerEvent(
          state,
          {
            messageType: ENTITY_INTERACTION,
            entityPath: toLine.idxPath,
            interaction: "dragend",
          },
          player.clientID,
        ),
      ),
    ).rejects.toThrow()

    expect(dragHandToHand.end[0].getCommand).not.toHaveBeenCalled()
    expect(dragLineToLine.end[0].getCommand).not.toHaveBeenCalled()
  })
})

describe("dragging into not allowed place", () => {
  let dragToHand: DragActionDefinition<State>

  let fromHand: LabeledEntity
  let parentHand: LabeledParent
  let toLine: LabeledParent

  beforeEach(() => {
    state = new State()
    room = new TestRoom()
    room.state = state

    state.players.push(player)

    parentHand = new LabeledParent(state, { type: "hand" })
    fromHand = new LabeledEntity(state, {
      type: "classicCard",
      parent: parentHand,
    })

    toLine = new LabeledParent(state, { type: "line" })

    player.dragStartEntity = fromHand
  })

  describe("fail on checkPrerequisites", () => {
    beforeEach(() => {
      dragToHand = defineDragAction<State>({
        name: "DragToHand",
        start: {
          interaction: () => "*",
          conditions,
        },
        end: { interaction: () => [{ type: "hand" }], conditions, command },
      })
      jest.spyOn(dragToHand.start, "getCommand")
      jest.spyOn(dragToHand.end[0], "getCommand")

      room.possibleActions = [dragToHand]
      manager = new CommandsManager(room)
      room.commandsManager = manager
    })

    it("clears action from pending", async () => {
      await expect(
        manager.handlePlayerEvent(
          populatePlayerEvent(
            state,
            {
              messageType: ENTITY_INTERACTION,
              entityPath: fromHand.idxPath,
              interaction: "dragstart",
            },
            player.clientID,
          ),
        ),
      ).resolves.toBe(true)

      expect(dragToHand.start.getCommand).toHaveBeenCalled()
      expect(manager.pendingActions.get(clientID).action).toBe(dragToHand)

      await expect(
        manager.handlePlayerEvent(
          populatePlayerEvent(
            state,
            {
              messageType: ENTITY_INTERACTION,
              entityPath: toLine.idxPath,
              interaction: "dragend",
            },
            player.clientID,
          ),
        ),
      ).rejects.toThrow()

      expect(dragToHand.end[0].getCommand).not.toHaveBeenCalled()
      expect(manager.pendingActions.get(clientID)).toBeUndefined()
    })
  })

  describe("fail on checkConditions", () => {
    beforeEach(() => {
      dragToHand = defineDragAction<State>({
        name: "DragToHand",
        start: { interaction: () => "*", conditions },
        end: {
          interaction: () => "*",
          conditions: (test) => {
            test("Should always fail").set(true).is.false()
          },
          command,
        },
      })
      jest.spyOn(dragToHand.start, "getCommand")
      jest.spyOn(dragToHand.end[0], "getCommand")

      room.possibleActions = [dragToHand]
      manager = new CommandsManager(room)
      room.commandsManager = manager
    })

    it("clears action from pending", async () => {
      await expect(
        manager.handlePlayerEvent(
          populatePlayerEvent(
            state,
            {
              messageType: ENTITY_INTERACTION,
              entityPath: fromHand.idxPath,
              interaction: "dragstart",
            },
            player.clientID,
          ),
        ),
      ).resolves.toBe(true)

      expect(dragToHand.start.getCommand).toHaveBeenCalled()
      expect(manager.pendingActions.get(clientID).action).toBe(dragToHand)

      await expect(
        manager.handlePlayerEvent(
          populatePlayerEvent(
            state,
            {
              messageType: ENTITY_INTERACTION,
              entityPath: toLine.idxPath,
              interaction: "dragend",
            },
            player.clientID,
          ),
        ),
      ).rejects.toThrow()

      expect(dragToHand.end[0].getCommand).not.toHaveBeenCalled()
      expect(manager.pendingActions.get(clientID)).toBeUndefined()
    })
  })
})
