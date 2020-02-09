import { flag, resetNegation, postAssertion, ref } from "./utils"

import { isChild } from "../traits/child"
import { hasOwnership } from "../traits/ownership"
import { hasSelectableChildren } from "../traits/selectableChildren"

const getMessage = (
  target,
  result: boolean,
  message: string,
  messageNot: string,
  expected?: any,
  actual?: any
): string => {
  const not = flag(target, "not")

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

class ConditionAssertions {
  /**
   *
   * @param result
   * @param errMessage use #{exp} and #{act} to inject values in error messages
   * @param [errMessageNot] use #{exp} and #{act} to inject values in error messages
   * @param [expected]
   * @param [actual]
   */
  private assert(
    result: boolean,
    errMessage: string,
    errMessageNot?: string,
    expected?,
    actual?
  ): void {
    const not = flag(this, "not")
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
  }

  /**
   * @asserts subject should be empty.
   */
  empty(): this {
    const subject = flag(this, "subject")
    const propName = flag(this, "propName")
    const printPropName = propName ? `'${propName}' = ` : ""

    if (subject.length !== undefined && typeof subject !== "function") {
      this.assert(
        subject.length === 0,
        `subject ${printPropName}(iterable) has some items.`,
        `subject ${printPropName}(iterable) is empty, but shouldn't.`
      )
    } else if (`size` in subject) {
      this.assert(
        subject.size === 0,
        `subject ${printPropName}(map/set) has some items.`,
        `subject ${printPropName}(map/set) is empty, but shouldn't.`
      )
    } else if (typeof subject === "object" && subject !== null) {
      this.assert(
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
   * Compares current subject to given value, no coercion (strict equality).
   * @asserts that subject is equal to provided value.
   * @alias equals
   */
  equals(value: any): this {
    const subject = flag(this, "subject")
    const propName = flag(this, "propName")
    const printPropName = propName ? `'${propName}' = ` : ""

    this.assert(
      subject === value,
      `expected ${printPropName}#{act} to equal #{exp}`,
      `expected ${printPropName}#{act} to NOT equal #{exp}`,
      value,
      subject
    )

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
   * @alias equals
   */
  above(value: number): this {
    const subject = flag(this, "subject")
    const propName = flag(this, "propName")
    const printPropName = propName ? `'${propName}' = ` : ""

    this.assert(
      subject > value,
      `expected ${printPropName}#{exp} to be above #{act}`,
      `expected ${printPropName}#{exp} to be below #{act}`,
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
   * @alias equals
   */
  below(value: number): this {
    const subject = flag(this, "subject")
    const propName = flag(this, "propName")
    const printPropName = propName ? `'${propName}' = ` : ""

    this.assert(
      subject < value,
      `expected ${printPropName}#{exp} to be below #{act}`,
      `expected ${printPropName}#{exp} to be above #{act}`,
      value,
      subject
    )

    return this
  }

  /**
   * @asserts that subject (IParent) has exactly the expected children count.
   */
  childrenCountOf(value: number): this {
    const subject = flag(this, "subject")
    const count = subject.countChildren()

    this.assert(
      count == value,
      `subject[#{act}] doesn't have exactly #{exp} children`,
      `subject[#{act}] has exactly #{exp} children, but shouldn't`,
      value,
      count
    )

    return this
  }

  /**
   * @asserts that subject is equal to one of the provided values. Coercion allowed.
   */
  oneOf(values: any[]): this {
    const subject = flag(this, "subject")

    const result = values.some(val => subject == val)

    this.assert(
      result,
      `#{act} didn't match with any of the provided values: #{exp}`,
      `#{act} is in #{exp}, but it shouldn't`,
      values,
      subject
    )

    return this
  }

  /**
   * @asserts
   */
  matchesPropOf(refName: string | symbol): this {
    // TODO: accept queryProps?
    const propName = flag(this, "propName")

    if (!flag(this, "propParent")) {
      throw new Error(
        `matchesPropOf | Needs to be preceded with ".its" to pick a prop name`
      )
    }

    const subject = flag(this, "subject")
    const expected = ref(this, refName)[propName]

    this.assert(
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
    const subject = flag(this, "subject")

    if (!isChild(subject)) {
      this.assert(false, `selectable | applies only on child entities`)
      return this
    }

    this.assert(
      hasSelectableChildren(subject.parent),
      `selectable | subject's parent can't have children selected`,
      `selectable | subject's parent can have children selected, but shouldn't`
    )
    return this
  }

  selected(): this {
    const subject = flag(this, "subject")

    if (!isChild(subject)) {
      this.assert(false, `isSelected | is not a child`)
      return this
    }

    const result = hasSelectableChildren(subject.parent)
      ? subject.parent.isChildSelected(subject.idx)
      : false

    this.assert(
      result,
      `isSelected | subject is not selected`,
      `isSelected | subject is selected, but shouldn't`
    )

    return this
  }

  /**
   * Does current player has a specific UI element presented to him?
   * If `uiKey` is left empty, function will test if player
   * has ANY ui interface presented.
   * Ignores current subject and instead is based on `state` and `event`.
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
    const { ui } = flag(this, "state")
    const { clientID } = flag(this, "player")

    if (uiKey) {
      // 1. uiKey needs to exist
      if (!(uiKey in ui)) {
        throw new Error(
          `revealedUI | this UI doesn't have "${uiKey}" key defined`
        )
      }

      // 2. Current client has to be on the list
      const uiValues = Array.isArray(ui[uiKey]) ? ui[uiKey] : [ui[uiKey]]
      const result = uiValues.some(client => clientID === client)
      this.assert(
        result,
        `revealedUI | client doesn't have "${uiKey}" UI presented to him`,
        `revealedUI | client has "${uiKey}" UI presented to him, but shouldn't`
      )
    } else {
      const uiKeys = Object.keys(ui).filter(
        // FIXME: StateUI for some reason needs these keys...
        key => !["clone", "onAdd", "onRemove", "onChange"].includes(key)
      )

      const result = uiKeys.some(key => ui[key].includes(clientID))
      this.assert(
        result,
        `revealedUI | client doesn't have any UI revealed`,
        `revealedUI | client has some UI revealed, but shouldn't`
      )
    }

    resetNegation(this)
    postAssertion(this)
    return this
  }

  // === Assertions which ignore current subject ===

  /**
   * Ignores current subject.
   * @asserts that player is interacting with an entity which belongs to them
   */
  get owner(): this {
    const entity = flag(this, "entity")
    const player = flag(this, "player")

    if (hasOwnership(entity)) {
      const expected = entity.getOwner()

      this.assert(
        player === expected,
        `Player "#{act}" is not an owner.`,
        `Player "#{act}" is an owner, but shouldn't`,
        expected && expected.clientID,
        hasOwnership(entity) ? entity.getOwner().clientID : undefined
      )
    } else {
      this.assert(false, `Given entity is not ownable.`)
    }

    return this
  }

  /**
   * Ignores current subject
   * @asserts if interacting player currently has the turn.
   */
  get playersTurn(): this {
    const { currentPlayer } = flag(this, "state")
    const player = flag(this, "player")

    this.assert(
      player === currentPlayer,
      `It's not current players turn`,
      `It is current players turn, but shouldn't`
    )

    return this
  }
}

export { ConditionAssertions }
