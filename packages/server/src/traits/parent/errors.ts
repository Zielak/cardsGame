import type { ChildTrait } from "../child.js"

const INDEX_DOESNT_FIT_RANGE = (desired: number, max: number): string =>
  `idex is not in available range, desired:${desired}, max:${max}`

const acPrefix = "addChild | "
const ADDCHILD_MISSING_ARG0 = (): string =>
  acPrefix + `missing required argument "entity"`
const ADDCHILD_NO_EMPTY_SPOTS = (): string =>
  acPrefix + "no more empty spots to place the item in."
const ADDCHILD_INDEX_OCCUPIED = (): string => acPrefix + "index occupied"
const ADDCHILD_UNEXPECTED_NO_SPOT = (): string =>
  acPrefix + "shouldn't happen! can't actually find any empty spot"

const mtPrefix = "moveChildTo | "
const MOVECHILDTO_NOTHING_TO_MOVE = (idx: number): string =>
  mtPrefix + `I don't have ${idx} child, nothing to move.`
const MOVECHILDTO_MOVE_FAILED = (
  from: number,
  to: number,
  innerError: string
): string => mtPrefix + `${from}->${to} failed: ${innerError}`

const VERY_UNEXPECTED_ERROR = (
  child: ChildTrait,
  removedChild: ChildTrait
): string =>
  `How the f**k did that happen?
  child: ${child.idx}:${child["name"]}
  removedChild: ${removedChild.idx}:${removedChild["name"]}`

export const errors = {
  ADDCHILD_MISSING_ARG0,
  ADDCHILD_NO_EMPTY_SPOTS,
  ADDCHILD_INDEX_OCCUPIED,
  VERY_UNEXPECTED_ERROR,
  ADDCHILD_UNEXPECTED_NO_SPOT,
  INDEX_DOESNT_FIT_RANGE,
  MOVECHILDTO_NOTHING_TO_MOVE,
  MOVECHILDTO_MOVE_FAILED,
}
