import type {
  ChildTrait,
  Entity,
  Room,
  State,
  EveryEntity,
  CommonKeysToIgnore,
} from "@cardsgame/server"
import type { QuerableProps } from "@cardsgame/server/lib/queryRunner"

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
 * @example
 * {
 *   children: [
 *     { type: "classicCard", name: "D7" },
 *     { type: "classicCard", name: "D3" },
 *   ],
 *   selected: [1]
 * }
 * @example
 * { type: "classicCard", suit: "D", rank: "3", faceUp: false }
 * @memberof serverTesting
 */
export type EntityMockingDefinition = EntityMockingProps &
  ChildrenMockingArray & {
    /**
     * used to figure out what kind of entity to create
     * @default "classicCard"
     * @memberof serverTesting
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
   * {
   *   type: "hand",
   *   children: [
   *     {type: "classicCard", name: "D7"},
   *     {type: "classicCard", name: "D8"}
   *   ]
   * }
   * @memberof serverTesting
   */
  children?: EntityMockingDefinition[]
}

type StateKeysToIgnore = "currentPlayer" | "maxChildren" | "clients" | "players"

type StateMockingProps<S> = Partial<
  Omit<NonFunctionProperties<S>, CommonKeysToIgnore | StateKeysToIgnore>
>

/**
 * Definition of root game state.
 * @example
 * {
 *   round: 1,
 *   children: [
 *     {type: "classicCard", name: "D7"}
 *   ]
 * }
 * @memberof serverTesting
 */
export type StateMockingRecord<S extends State> = ChildrenMockingArray &
  StateMockingProps<S> &
  Partial<{
    clients: string[]
    players: Partial<IPlayerDefinition>[]
  }>

export type StateMockingTuple = [
  QuerableProps | undefined,
  EntityMockingDefinition
]
