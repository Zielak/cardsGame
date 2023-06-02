import type {
  ClassicCard,
  Container,
  Deck,
  Grid,
  Hand,
  Line,
  Pile,
  Spread,
} from "../entities/index.js"

import { QuerableProps } from "./types.js"

/**
 * Used internally and in `@cardsgame/server-testing` package.
 * Not for public usage
 * @ignore
 */
export type EveryEntity = ClassicCard &
  Container &
  Deck &
  Grid &
  Hand &
  Line &
  Pile &
  Spread

/**
 * Used internally and in `@cardsgame/server-testing` package.
 * Not for public usage
 * @ignore
 */
export type CommonKeysToIgnore =
  | "$changed"
  | "childrenPointers"
  | "hijacksInteractionTarget"
  | "id"
  | "idxPath"
  | "parent"
  | "selectedChildren"

/**
 * Used internally and in `@cardsgame/server-testing` package.
 * Not for public usage
 * @ignore
 */
export type EntityOptions = Partial<
  Omit<NonFunctionProperties<EveryEntity>, CommonKeysToIgnore>
>

export type HelperQuerableProps = {
  parent?: QuerableProps
  selected?: boolean
  selectionIndex?: number | number[]
}

export type EntityQuerableProps = {
  [k in keyof EntityOptions]:
    | EntityOptions[k]
    | EntityOptions[k][]
    | ((value: EntityOptions[k]) => boolean)
}

const helperQuerablePropKeys: (keyof HelperQuerableProps)[] = [
  "parent",
  "selected",
  "selectionIndex",
]
export const isHelperQuerableProp = (
  s: unknown
): s is keyof HelperQuerableProps => {
  return helperQuerablePropKeys.includes(s as any)
}
