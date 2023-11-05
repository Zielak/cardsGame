import type {
  QuerableProps,
  Room,
  State,
  CommonKeysToIgnore,
  EveryEntity,
  traits,
} from "@cardsgame/server"

export type StateGetter<S extends State> = () => S
export type RoomGetter<S extends State, R extends Room<S>> = () => R

export type EntityConstructor = new (
  state: State,
  options?: Record<string, any>,
) => traits.Entity<any> & traits.ChildTrait

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
 * An object _describing_ an initial root state.
 * This definition may contain state's props like `"isGameStarted"`.
 *
 * To populate state with entities - use `populateState()`
 *
 * @example Game state at round 10, with 2 players playing.
 * ```ts
 * {
 *   isGameStarted: true,
 *   round: 10,
 *   players: [
 *     { clientID: CLIENT_ID, name: "Darek" },
 *     { clientID: "clientB", name: "Pau" },
 *   ],
 * }
 * ```
 */
export type InitialStateDescription<S extends State> = StateMockingProps<S> &
  Partial<{
    clients: string[]
    players: Partial<PlayerDefinition>[]
  }>

export type PopulateStateTuple = [
  QuerableProps | undefined,
  EntityMockingDefinition,
]
