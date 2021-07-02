import { isGrid } from "../entities"
import { QuerableProps, queryRunner } from "../queryRunner"
import { isChild } from "../traits/child"
import { isParent } from "../traits/parent"
import { isParentMap } from "../traits/parentMap"
import { hasSelectableChildren } from "../traits/selectableChildren"

import { getFlag, postAssertion, ref, resetNegation } from "./utils"

const getMessage = (
  target,
  result: boolean,
  message: string,
  messageNot: string,
  expected?: any,
  actual?: any
): string => {
  const not = getFlag(target, "not")

  const expT = "#{exp}"
  const actT = "#{act}"

  if (!not) {
    return message.replace(expT, expected).replace(actT, actual)
  } else {
    return messageNot
      ? messageNot.replace(expT, expected).replace(actT, actual)
      : ""
  }
}

/**
 * @param result
 * @param errMessage use #{exp} and #{act} to inject values in error messages
 * @param [errMessageNot] use #{exp} and #{act} to inject values in error messages
 * @param [expected]
 * @param [actual]
 */
export function assert(
  this: any,
  result: boolean,
  errMessage: string,
  errMessageNot?: string,
  expected?: unknown,
  actual?: unknown
): void {
  const not = getFlag(this, "not")
  const ok = not ? !result : result

  if (!ok) {
    const msg = getMessage(
      this,
      result,
      errMessage,
      errMessageNot,
      expected,
      actual
    )

    resetNegation(this)
    postAssertion(this)
    throw new Error(msg)
  }

  resetNegation(this)
  postAssertion(this)
}

class ConditionAssertions {
  /**
   * @asserts subject should be empty.
   */
  empty(): this {
    const subject = getFlag(this, "subject")
    const propName = getFlag(this, "propName")
    const printPropName = propName ? `'${propName}' = ` : ""

    if (subject.length !== undefined && typeof subject !== "function") {
      assert.call(
        this,
        subject.length === 0,
        `subject ${printPropName}(iterable) has some items.`,
        `subject ${printPropName}(iterable) is empty, but shouldn't.`
      )
    } else if (`size` in subject) {
      assert.call(
        this,
        subject.size === 0,
        `subject ${printPropName}(map/set) has some items.`,
        `subject ${printPropName}(map/set) is empty, but shouldn't.`
      )
    } else if (typeof subject === "object" && subject !== null) {
      assert.call(
        this,
        Object.keys(subject).length === 0,
        `subject ${printPropName}(object) has some items.`,
        `subject ${printPropName}(object) is empty, but shouldn't.`
      )
    } else {
      throw new Error(`.empty | Given an invalid subject: ${subject}`)
    }

    return this
  }

  /**
   * @asserts that subject can't hold any more new items.
   * Only makes sense with entities with ParentMapTrait, for example `Grid`.
   * @example
   * // Check if grid has some space available
   * con.entity.is.not.full()
   */
  full(): this {
    const subject = getFlag(this, "subject")

    if (!isParentMap(subject)) {
      throw new Error(
        `full | applies only on parent of "map" structure (ParentMapTrait)`
      )
    }

    assert.call(
      this,
      subject.countChildren() >= subject.maxChildren,
      `subject is not full`,
      `subject is full`
    )
    return this
  }

  /**
   * @asserts that container has index empty
   */
  availableSpotAt(index: number): this
  /**
   * @asserts that **Grid** has spot available at specified column/row
   */
  availableSpotAt(column: number, row: number): this
  availableSpotAt(arg0: number, arg1?: number): this {
    const subject = getFlag(this, "subject")

    if (!isParent(subject)) {
      throw new Error(`availableSpot | applies only on parents`)
    }

    if (typeof arg0 === "number" && arg1 === undefined) {
      assert.call(
        this,
        subject.getChild(arg0) === undefined,
        `spot [${arg0}] is occupied`,
        `spot [${arg0}] is available but shouldn't`
      )
    } else if (typeof arg0 === "number" && typeof arg1 === "number") {
      if (!isGrid(subject)) {
        throw new Error(`availableSpot | column/row, expected Grid container`)
      }

      assert.call(
        this,
        subject.getChildAt(arg0, arg1) === undefined,
        `spot [${arg0},${arg1}] is occupied`,
        `spot [${arg0},${arg1}] is available but shouldn't`
      )
    } else {
      throw new Error(`availableSpot | incorrect arguments, expected numbers`)
    }

    return this
  }

  /**
   * Compares current subject to given value, no coercion (strict equality).
   * @asserts that subject is equal to provided value.
   */
  equals(value: unknown): this {
    const subject = getFlag(this, "subject")
    const propName = getFlag(this, "propName")
    const printPropName = propName ? `'${propName}' = ` : ""

    assert.call(
      this,
      subject === value,
      `expected ${printPropName}#{act} to equal #{exp}`,
      `expected ${printPropName}#{act} to NOT equal #{exp}`,
      value,
      subject
    )

    return this
  }

  /**
   * @asserts that value is exactly `true`
   */
  true(): this {
    const subject = getFlag(this, "subject")
    const propName = getFlag(this, "propName")
    const printPropName = propName ? `'${propName}' = ` : ""

    if (getFlag(this, "not")) {
      throw new Error(`Don't be silly, just use "false()" instead.`)
    }

    assert.call(
      this,
      subject === true,
      `expected ${printPropName}${subject} to equal true`
    )

    return this
  }

  /**
   * @asserts that value is exactly `false`
   */
  false(): this {
    const subject = getFlag(this, "subject")
    const propName = getFlag(this, "propName")
    const printPropName = propName ? `'${propName}' = ` : ""

    if (getFlag(this, "not")) {
      throw new Error(`Don't be silly, just use "true()" instead.`)
    }

    assert.call(
      this,
      subject === false,
      `expected ${printPropName}${subject} to equal false`
    )

    return this
  }

  /**
   * @asserts that subject is not undefined
   */
  defined(): this {
    const subject = getFlag(this, "subject")

    if (getFlag(this, "not")) {
      throw new Error(`Don't be silly, just use "undefined()" instead.`)
    }

    assert.call(this, subject !== undefined, `subject is undefined.`)

    return this
  }

  /**
   * @asserts that subject is undefined
   */
  undefined(): this {
    const subject = getFlag(this, "subject")

    if (getFlag(this, "not")) {
      throw new Error(`Don't be silly, just use "defined()" instead.`)
    }

    assert.call(this, subject === undefined, `subject is defined.`)

    return this
  }

  // (5).above(10)
  // (5).above(5)
  // (5).above(0)
  // (5).not.above(0)
  // (5).not.above(5)
  // (5).not.above(10)
  /**
   * @asserts that subject is numerically above the provided value.
   */
  above(value: number): this {
    const subject = getFlag(this, "subject")
    const propName = getFlag(this, "propName")
    const printPropName = propName ? `'${propName}' = ` : ""

    assert.call(
      this,
      subject > value,
      `expected ${printPropName}#{act} to be above #{exp}`,
      `expected ${printPropName}#{act} to NOT be above #{exp}`,
      value,
      subject
    )

    return this
  }

  /**
   * @asserts that subject is numerically above OR equal to the provided value.
   */
  aboveEq(value: number): this {
    const subject = getFlag(this, "subject")
    const propName = getFlag(this, "propName")
    const printPropName = propName ? `'${propName}' = ` : ""

    assert.call(
      this,
      subject >= value,
      `expected ${printPropName}#{act} to be above #{exp}`,
      `expected ${printPropName}#{act} to NOT be above #{exp}`,
      value,
      subject
    )

    return this
  }

  // (5).below(10)
  // (5).below(5)
  // (5).below(0)
  // (5).not.below(0)
  // (5).not.below(5)
  // (5).not.below(10)
  /**
   * @asserts that subject is numerically below the provided value.
   */
  below(value: number): this {
    const subject = getFlag(this, "subject")
    const propName = getFlag(this, "propName")
    const printPropName = propName ? `'${propName}' = ` : ""

    assert.call(
      this,
      subject < value,
      `expected ${printPropName}#{act} to be below #{exp}`,
      `expected ${printPropName}#{act} to NOT be below #{exp}`,
      value,
      subject
    )

    return this
  }

  /**
   * @asserts that subject is numerically below or equal to the provided value.
   */
  belowEq(value: number): this {
    const subject = getFlag(this, "subject")
    const propName = getFlag(this, "propName")
    const printPropName = propName ? `'${propName}' = ` : ""

    assert.call(
      this,
      subject <= value,
      `expected ${printPropName}#{act} to be below or equal to #{exp}`,
      `expected ${printPropName}#{act} to NOT be below or equal to #{exp}`,
      value,
      subject
    )

    return this
  }

  /**
   * @asserts that subject is equal to one of the provided values. Coercion allowed.
   */
  oneOf(values: any[]): this {
    const subject = getFlag(this, "subject")

    const result = values.some((val) => subject == val)

    assert.call(
      this,
      result,
      `#{act} didn't match with any of the provided values: #{exp}`,
      `#{act} is in #{exp}, but it shouldn't`,
      values,
      subject
    )

    return this
  }

  /**
   * @asserts that chosen prop value matches the same prop on other subject
   * @example
   * con.entity.its("rank").matchesPropOf("pileTop")
   */
  matchesPropOf(refName: string): this {
    // don't? TODO: accept queryProps?
    const propName = getFlag(this, "propName")

    if (!getFlag(this, "propParent")) {
      throw new Error(
        `matchesPropOf | Needs to be preceded with ".its" to pick a prop name`
      )
    }

    const subject = getFlag(this, "subject")
    const testSubject = ref(this, refName)

    if (!testSubject) {
      throw new Error(
        `matchesPropOf | couldn't find anything by ref "${refName}"`
      )
    }

    const expected = testSubject[propName]

    assert.call(
      this,
      subject === expected,
      `subject's '${propName}' (#{act}) doesn't match with the same prop at '${String(
        refName
      )}' (#{exp})`,
      `subject's '${propName}' (#{act}) is equal with prop of '${String(
        refName
      )}', but shouldn't (#{exp})`,
      expected,
      subject
    )

    return this
  }

  /**
   * @asserts if entity can be selected. Checks if parent extends `SelectableChildrenTrait`
   */
  selectable(): this {
    const subject = getFlag(this, "subject")

    if (!isChild(subject)) {
      throw new Error(`selectable | applies only on child entities`)
    }

    assert.call(
      this,
      hasSelectableChildren(subject.parent),
      `selectable | subject's parent can't have children selected`,
      `selectable | subject's parent can have children selected, but shouldn't`
    )
    return this
  }

  selected(): this {
    const subject = getFlag(this, "subject")

    if (!isChild(subject)) {
      throw new Error(`isSelected | is not a child`)
    }

    const result = hasSelectableChildren(subject.parent)
      ? subject.parent.isChildSelected(subject.idx)
      : false

    assert.call(
      this,
      result,
      `isSelected | subject is not selected`,
      `isSelected | subject is selected, but shouldn't`
    )

    return this
  }

  /**
   * @asserts that at least one item or child elements has all given properties
   */
  someEntitiesMatchProps(props: QuerableProps): this {
    const subject = getFlag(this, "subject")

    if (Array.isArray(subject)) {
      const result = subject.some(queryRunner(props))

      assert.call(
        this,
        result,
        `someEntityMatchesProps | no item matched`,
        `someEntityMatchesProps | some item matched, but shouldn't`
      )
    } else if (isParent(subject)) {
      const result = subject.getChildren().some(queryRunner(props))

      assert.call(
        this,
        result,
        `someEntityMatchesProps | no child matched`,
        `someEntityMatchesProps | some child matched, but shouldn't`
      )
    } else {
      throw new Error(
        `someEntitiesMatchProps | subject is neither parent nor array`
      )
    }

    return this
  }

  /**
   * @asserts that all items in collection OR child elements or parent match all given properties
   */
  everyEntityMatchesProps(props: QuerableProps): this {
    const subject = getFlag(this, "subject")

    if (Array.isArray(subject)) {
      const result = subject.every(queryRunner(props))

      assert.call(
        this,
        result,
        `everyEntityMatchesProps | not every item matched`,
        `everyEntityMatchesProps | every item matched, but shouldn't`
      )
    } else if (isParent(subject)) {
      const result = subject.getChildren().every(queryRunner(props))

      assert.call(
        this,
        result,
        `everyEntityMatchesProps | not every child matched`,
        `everyEntityMatchesProps | every child matched, but shouldn't`
      )
    } else {
      throw new Error(
        `everyEntityMatchesProps | subject is neither parent nor array`
      )
    }

    return this
  }

  /**
   * Runs given callback with current `subject` as the only argument.
   * @asserts if given callback returns truthy
   * @example
   * const isKing = (card: ClassicCard) => {
   *   return card.rank === "K"
   * }
   * // Will test if target of interaction is in fact a King
   * con.entity.test(isKing)
   */
  test(tester: (subject: any) => boolean): this {
    const subject = getFlag(this, "subject")

    const result = tester.call(undefined, subject)

    assert.call(
      this,
      result,
      `test | ${tester.name} returned falsy`,
      `test | ${tester.name} returned truthy`
    )

    return this
  }

  /**
   * **REQUIRES** `"player"` reference.
   *
   * Does current player has a specific UI element presented to him?
   * If `uiKey` is left empty, function will test if player
   * has ANY ui interface presented.
   * Ignores current subject and instead is based on `state` and `player`.
   * @asserts
   * @example
   * // player has ANY UI revealed
   * con.revealedUI()
   * // player doesn't have ANY UI revealed
   * con.not.revealedUI()
   * // player has "rankChooser" revealed
   * con.revealedUI("rankChooser")
   * // player doesn't have "rankChooser" revealed
   * con.not.revealedUI("rankChooser")
   */
  revealedUI(uiKey?: string): this {
    const { ui } = getFlag(this, "state")
    const clientID = getFlag(this, "initialSubjects").player.clientID

    if (uiKey) {
      // 1. uiKey needs to exist
      if (!(uiKey in ui)) {
        throw new Error(
          `revealedUI | this UI doesn't have "${uiKey}" key defined`
        )
      }

      // 2. Current client has to be on the list
      const uiValues = Array.isArray(ui[uiKey]) ? ui[uiKey] : [ui[uiKey]]
      const result = uiValues.some((client) => clientID === client)
      assert.call(
        this,
        result,
        `revealedUI | client doesn't have "${uiKey}" UI presented to him`,
        `revealedUI | client has "${uiKey}" UI presented to him, but shouldn't`
      )
    } else {
      const uiKeys = Object.keys(ui).filter(
        // FIXME: StateUI for some reason needs these keys...
        (key) => !["clone", "onAdd", "onRemove", "onChange"].includes(key)
      )

      const result = uiKeys.some((key) => ui[key].includes(clientID))
      assert.call(
        this,
        result,
        `revealedUI | client doesn't have any UI revealed`,
        `revealedUI | client has some UI revealed, but shouldn't`
      )
    }

    resetNegation(this)
    postAssertion(this)
    return this
  }

  /**
   * **REQUIRES** `"player"` reference.
   *
   * @asserts if interacting player/bot currently has the turn.
   * Will also throw if current `Conditions` wasn't setup with "player" prop.
   */
  itsPlayersTurn(): this {
    const { currentPlayer } = getFlag(this, "state")
    const player = getFlag(this, "initialSubjects").player

    assert.call(
      this,
      player === currentPlayer,
      `It's not current players turn`,
      `It is current players turn, but shouldn't`
    )

    return this
  }
}

export { ConditionAssertions }
