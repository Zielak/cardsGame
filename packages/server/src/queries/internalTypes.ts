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
  AllowArrays<Omit<NonFunctionProperties<EveryEntity>, CommonKeysToIgnore>>
>
