import type { QuerableProps, Room, State } from "@cardsgame/server"
import type {
  CommonKeysToIgnore,
  EveryEntity,
} from "@cardsgame/server/internal/queries/internalTypes"
import type { ChildTrait, Entity } from "@cardsgame/server/traits"

export type StateGetter<S extends State> = () => S
export type RoomGetter<S extends State, R extends Room<S>> = () => R

export type EntityConstructor = new (
  state: State,
  options?: Record<string, any>
) => Entity<any> & ChildTrait

/**
 * More keys to ignore from preparation, as these are read-only getters or
 * make no sense in re-creating
 *
 * - `topDeck`, `childCount` - are like getters of `children` array
 */
type EntityKeysToIgnore = "topDeck" | "childCount"

type EntityMockingProps = Partial<
  Omit<
    NonFunctionProperties<EveryEntity>,
    CommonKeysToIgnore | EntityKeysToIgnore
  >
>

/**
 * An object _describing_ any possible entity. This is not an [Entity](/api/server/classes/Entity) in itself.
 *
 * @example "D7" card placed with its face down:
 * ```ts
 * { type: "classicCard", suit: "D", rank: "3", faceUp: false }
 * ```
 *
 * @example Some container with 2 cards, with second one being selected:
 * ```ts
 * {
 *   children: [
 *     { type: "classicCard", name: "D7" },
 *     { type: "classicCard", name: "D3" },
 *   ],
 *   selected: [1]
 * }
 * ```
 * :::note
 *
 * `name: "D7"` is a shorthand. Given this object is of type `"classicCard"`,
 * this object will get populated with 2 new props: `rank: "7"` and `suit: "D"`
 *
 * :::
 *
 */
export type EntityMockingDefinition = EntityMockingProps &
  ChildrenMockingArray & {
    /**
     * used to figure out what kind of entity to create
     * @default "classicCard"
     */
    type?: string
    /**
     * Indexes of selected children. Order is used to determine `selectionIndex`.
     *
     * Doesn't apply on non-parent/non-selectable entities.
     */
    selected?: number[]
  }

type ChildrenMockingArray = {
  /**
   * In items of this array:
   *
   * - `type` is required, used to figure out what kind of entity to create
   * - `name` could be used to generate rest of the props. Example of "classicCard" - name:"D7" -> rank:"7",suit:"D"
   *
   * @example
   * ```ts
   * {
   *   type: "hand",
   *   children: [
   *     {type: "classicCard", name: "D7"},
   *     {type: "classicCard", name: "D8"}
   *   ]
   * }
   * ```
   */
  children?: EntityMockingDefinition[]
}

type StateKeysToIgnore = "currentPlayer" | "maxChildren" | "clients" | "players"

type StateMockingProps<S> = Partial<
  Omit<NonFunctionProperties<S>, CommonKeysToIgnore | StateKeysToIgnore>
>

/**
 * An object _describing_ a root state.
 * This definition may contain state's props like `"isGameStarted"`,
 * and all the other [entities](#entitymockingdefinition) in `"children"` array.
 * @example Game state at round 10, only one card on the table.
 * ```ts
 * {
 *   round: 10,
 *   children: [
 *     {type: "classicCard", name: "D7"}
 *   ]
 * }
 * ```
 */
export type StateMockingRecord<S extends State> = ChildrenMockingArray &
  StateMockingProps<S> &
  Partial<{
    clients: string[]
    players: Partial<PlayerDefinition>[]
  }>

export type StateMockingTuple = [
  QuerableProps | undefined,
  EntityMockingDefinition
]
