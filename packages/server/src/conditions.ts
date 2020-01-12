import chalk from "chalk"

import { logs, IS_CHROME } from "@cardsgame/utils"

import { ServerPlayerEvent, Player } from "./player"
import { QuerableProps } from "./queryRunner"
import { State } from "./state"
import { isChild } from "./traits/child"
import { hasOwnership } from "./traits/ownership"
import { isParent } from "./traits/parent"
import { hasSelectableChildren } from "./traits/selectableChildren"

export type ConditionsConstructor<S extends State> = new (
  state: S,
  event: ServerPlayerEvent
) => Conditions<S>

const iconStyle = (bg = "transparent", color = "white") => `background: ${bg};
color: ${color};
padding: 0.1em 0.3em;
border-radius: 50%;
width: 1.3em;
height: 1.3em;
text-align: center;
width: 1.2em;
height: 1.2em;`

function flag(target, flagName, value?) {
  if (!target._flags) {
    throw new Error(`flag | Incompatible target.`)
  }
  if (arguments.length === 3) {
    target._flags.set(flagName, value)
  } else {
    return target._flags.get(flagName)
  }
}

export { flag as getConditionFlag }

const resetNegation = target => {
  target._flags.set("not", false)
}

const getMessage = (
  target,
  result: boolean,
  message: string,
  messageNot: string,
  expected?: any,
  actual?: any
) => {
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

class Conditions<S extends State> {
  _flags = new Map<string, any>()

  _state: S
  _event: ServerPlayerEvent
  get _player() {
    return this._event.player
  }

  _propParent: any
  _propName: any
  _refs = new Map<string | symbol, any>()

  constructor(state: S, event: ServerPlayerEvent) {
    this._state = state
    this._event = event

    flag(this, "not", false)
    flag(this, "subject", state)
    flag(this, "eitherLevel", 0)
  }

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
  ) {
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
      this._postAssertion()
      throw new Error(msg)
    }

    resetNegation(this)
  }

  _postAssertion() {
    if (this._propParent) {
      // Reset subject to the object, if we were
      // just asserting its key value
      flag(this, "subject", this._propParent)
      this._resetPropDig()
    }
  }

  _resetPropDig() {
    this._propParent = undefined
    this._propName = undefined
  }

  /**
   * Negates the following assertion.
   */
  get not(): this {
    flag(this, "not", true)
    return this
  }

  // Chainers
  get has(): this {
    return this
  }
  get to(): this {
    return this
  }
  get is(): this {
    return this
  }
  get can(): this {
    return this
  }
  get be(): this {
    return this
  }
  get and(): this {
    return this
  }

  // Subject changer
  /**
   * Changes subject to game's state
   * @yields `state`
   */
  get state(): this {
    flag(this, "subject", this._state)
    this._resetPropDig()

    return this
  }

  /**
   * Changes subject to a player of current interaction
   * @yields `player` of current interaction
   */
  get player(): this {
    flag(this, "subject", this._player)
    this._resetPropDig()

    return this
  }

  /**
   * Changes subject to interacted entity
   * @yields `entity` from players interaction
   */
  get entity(): this {
    flag(this, "subject", this._event.entity)
    this._resetPropDig()

    return this
  }

  /**
   * Sets new subject. This can be anything.
   * @yields completely new subject, provided in the argument
   */
  set(newSubject): this {
    flag(this, "subject", newSubject)

    return this
  }

  /**
   * Sets new subject, and entity, found by its previously defined `alias`
   * or by it's props. Provide multiple arguments to find an item by its
   * relation to parents.
   * @yields an entity, found by alias or `QuerableProps` query
   * @example ```
   * con.get({name: 'deck'}).as('deck')
   * con.get('deck')
   * // get([...] GrandParent, Parent, Child)
   * con.get('deck', {rank: 'K'})
   * ```
   */
  get(props: QuerableProps): this
  get(alias: string, props?: QuerableProps): this
  get(arg0: string | QuerableProps, arg1?: QuerableProps): this {
    let newSubject
    if (typeof arg0 === "string") {
      const alias = arg0
      if (arg1) {
        // find child of aliased subject
        newSubject = this._refs.get(alias).query(arg1)
      } else {
        // get just subject by alias
        newSubject = this._refs.get(alias)
      }
    } else {
      // find subject in State tree
      newSubject = this._state.query(arg0)
    }

    flag(this, "subject", newSubject)

    this._resetPropDig()

    return this
  }

  /**
   * Changes subject to a prop of its current subject.
   * @yields subject prop's value to be asserted. Will remember the reference to the object, so you can chain key checks
   * @example
   * con.entity
   *   .its('propA').equals('foo')
   *   .and.its('propB').above(5)
   */
  its(key: string): this {
    if (this._propParent) {
      flag(this, "subject", this._propParent[key])
    } else {
      this._propParent = flag(this, "subject")
      this._propName = key
      flag(this, "subject", this._propParent[key])
    }

    return this
  }

  /**
   * Remembers the subject with a given alias
   * @example ```
   * con.get({name: 'deck'}).as('deck')
   * ```
   */
  as(ref: string | symbol): void {
    this._refs.set(ref, flag(this, "subject"))

    flag(this, "subject", this._state)
  }

  /**
   * @yields children of current subject
   */
  get children(): this {
    const children = flag(this, "subject").getChildren()

    flag(this, "subject", children)

    return this
  }

  /**
   * @yields a child at a specific index (array or Parent)
   * @param index
   */
  nthChild(index: number): this {
    const subject = flag(this, "subject")

    if (typeof subject !== "object") {
      throw new Error(`nthChild | Subject must be an object`)
    }

    if (isParent(subject)) {
      flag(this, "subject", subject.getChild(index))
    } else {
      flag(this, "subject", subject[index])
    }

    return this
  }

  /**
   * @yields first element in collection
   */
  get bottom(): this {
    const subject = flag(this, "subject")

    if (typeof subject !== "object") {
      throw new Error(
        `bottom | Can't get the "bottom" of something other than an object`
      )
    }

    if ("length" in subject) {
      flag(this, "subject", subject[0])
    } else if (isParent(subject)) {
      flag(this, "subject", subject.getBottom())
    } else {
      throw new Error(`bottom | Couldn't decide how to get the "bottom" value`)
    }

    return this
  }

  /**
   * @yields last element in collection
   */
  get top(): this {
    const subject = flag(this, "subject")

    if (typeof subject !== "object") {
      throw new Error(
        `top | Can't get the "top" of something other than an object`
      )
    }

    if ("length" in subject) {
      flag(this, "subject", subject[subject.length - 1])
    } else if (isParent(subject)) {
      flag(this, "subject", subject.getTop())
    } else {
      throw new Error(`top | Couldn't decide how to get the "top" value`)
    }

    return this
  }

  /**
   * @yields {number} `length` property of a collection (or string)
   */
  get length(): this {
    const subject = flag(this, "subject")

    if (subject.length === undefined) {
      throw new Error(`length | Subject doesn't have "length" property`)
    }

    flag(this, "subject", subject.length)
    return this
  }

  /**
   * @yields all selected children
   */
  get selectedChildren(): this {
    const subject = flag(this, "subject")

    if (!isParent(subject)) {
      throw new Error(`selectedChildren | Expected subject to be parent`)
    }
    if (!hasSelectableChildren(subject)) {
      throw new Error(`selectedChildren | Subjects children are not selectable`)
    }

    flag(this, "subject", subject.getSelectedChildren())

    return this
  }

  /**
   * @yields all selected children
   */
  get unselectedChildren(): this {
    const subject = flag(this, "subject")

    if (!isParent(subject)) {
      throw new Error(`unselectedChildren | Expected subject to be parent`)
    }
    if (!hasSelectableChildren(subject)) {
      throw new Error(
        `unselectedChildren | Subjects children are not selectable`
      )
    }

    flag(this, "subject", subject.getUnselectedChildren())

    return this
  }

  /**
   * @yields {number} children count if `subject` is a `Parent`
   */
  get childrenCount(): this {
    const subject = flag(this, "subject")

    if (!isParent(subject)) {
      throw new Error(`childrenCount | Expected subject to be a parent`)
    }

    const count = subject.countChildren()
    flag(this, "subject", count)

    return this
  }

  /**
   * @yields {number} number of selected children if subject is parent
   */
  get selectedChildrenCount(): this {
    const subject = flag(this, "subject")

    if (!isParent(subject)) {
      throw new Error(`childrenCount | Expected subject to be parent`)
    }
    if (!hasSelectableChildren(subject)) {
      throw new Error(`childrenCount | Subjects children are not selectable`)
    }

    const count = subject.countSelectedChildren()
    flag(this, "subject", count)

    return this
  }

  /**
   * @yields {number} number of selected children if subject is parent
   */
  get unselectedChildrenCount(): this {
    const subject = flag(this, "subject")

    if (!isParent(subject)) {
      throw new Error(`unselectedChildrenCount | Expected subject to be parent`)
    }
    if (!hasSelectableChildren(subject)) {
      throw new Error(
        `unselectedChildrenCount | Subjects children are not selectable`
      )
    }

    const count = subject.countUnselectedChildren()
    flag(this, "subject", count)

    return this
  }

  /**
   * Loops through every item in subject's collection.
   * Each item is set as the `subject` with each iteration automatically.
   * After all iterations are done, the `subject` will be reset back to what it originally was.
   * If one of the items fail any assertions, whole `each` block fails.
   *
   * @param predicate a function in style of native `array.forEach`, but first argument is new Conditions instance. This `con` will have its own subject set to each item of current subject.
   * @example
   * con.get("chosenCards").children.each((con, item, index, array) => {
   *   con.its("rank").oneOf(["2", "3"])
   * })
   * @yields back anything that was before `.each()` command so you can chain it further
   */
  each(
    predicate: (
      con: Conditions<S>,
      item: any,
      index: number | string,
      collection: any
    ) => void
  ): this {
    const subject = flag(this, "subject")

    if (!Array.isArray(subject)) {
      throw new Error(`each | Expected subject to be an array`)
    }

    subject.forEach((item, index) => {
      const con = new Conditions<S>(this._state, this._event)
      flag(con, "subject", item)
      predicate.call(con, con, item, index, subject)
    })

    return this
  }

  // Commands?
  // Throw when assertion doesn't pass

  /**
   * Compares current subject to given value, no coercion (strict equality).
   * @asserts that subject is equal to provided value.
   * @alias equals
   */
  equals(value: any): this {
    const subject = flag(this, "subject"),
      propName = this._propName ? `'${this._propName}' = ` : ""

    this.assert(
      subject === value,
      `expected ${propName}#{act} to equal #{exp}`,
      `expected ${propName}#{act} to NOT equal #{exp}`,
      value,
      subject
    )

    return this
  }

  equal = this.equals

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
    const propName = this._propName ? `'${this._propName}' = ` : ""

    this.assert(
      subject > value,
      `expected ${propName}#{exp} to be above #{act}`,
      `expected ${propName}#{exp} to be below #{act}`,
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
    const propName = this._propName ? `'${this._propName}' = ` : ""

    this.assert(
      subject < value,
      `expected ${propName}#{exp} to be below #{act}`,
      `expected ${propName}#{exp} to be above #{act}`,
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
  matchesPropOf(ref: string | symbol): this {
    // TODO: accept queryProps?

    if (!this._propParent) {
      throw new Error(
        `matchesPropOf | Needs to be preceded with ".its" to pick a prop name`
      )
    }

    const subject = flag(this, "subject")
    const expected = this._refs.get(ref)[this._propName]

    this.assert(
      subject === expected,
      `subject's '${
        this._propName
      }' (#{act}) doesn't match with the same prop at '${String(
        ref
      )}' (#{exp})`,
      `subject's '${this._propName}' (#{act}) is equal with prop of '${String(
        ref
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
   * @asserts if interacting player currently has the turn.
   */
  get playersTurn(): this {
    const { currentPlayer } = this._state

    this.assert(
      this._player === currentPlayer,
      `It's not current players turn`,
      `It is current players turn, but shouldn't`
    )

    return this
  }

  /**
   * Does current player has a specific UI element presented to him?
   * If `uiKey` is left empty, function will test if player
   * has ANY ui interface presented.
   * Based on `state` and `event` instead of `subject`
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
    const { ui } = this._state

    if (uiKey) {
      // 1. uiKey needs to exist
      if (!(uiKey in ui)) {
        throw new Error(
          `revealedUI | this UI doesn't have "${uiKey}" key defined`
        )
      }

      // 2. Current client has to be on the list
      const uiValues = Array.isArray(ui[uiKey]) ? ui[uiKey] : [ui[uiKey]]
      const result = uiValues.some(client => this._player.clientID === client)
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

      const result = uiKeys.some(key => ui[key].includes(this._player.clientID))
      this.assert(
        result,
        `revealedUI | client doesn't have any UI revealed`,
        `revealedUI | client has some UI revealed, but shouldn't`
      )
    }

    resetNegation(this)
    this._postAssertion()
    return this
  }

  /**
   * @asserts
   * Subject should be empty
   */
  get empty(): this {
    const subject = flag(this, "subject")
    const propName = this._propName ? `'${this._propName}' = ` : ""

    if (subject.length !== undefined && typeof subject !== "function") {
      this.assert(
        subject.length === 0,
        `subject ${propName}(iterable) has some items.`,
        `subject ${propName}(iterable) is empty, but shouldn't.`
      )
    } else if (`size` in subject) {
      this.assert(
        subject.size === 0,
        `subject ${propName}(map/set) has some items.`,
        `subject ${propName}(map/set) is empty, but shouldn't.`
      )
    } else if (typeof subject === "object" && subject !== null) {
      this.assert(
        Object.keys(subject).length === 0,
        `subject ${propName}(object) has some items.`,
        `subject ${propName}(object) is empty, but shouldn't.`
      )
    } else {
      throw new Error(`.empty | Given an invalid subject: ${subject}`)
    }

    return this
  }

  /**
   * @asserts that player is interacting with an entity which belongs to them
   */
  get owner(): this {
    const entity = this._event.entity

    if (hasOwnership(entity)) {
      const expected = entity.getOwner()

      this.assert(
        this._player === expected,
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
   * @returns `state` reference
   */
  getState(): S {
    return this._state
  }

  /**
   * @returns player's `event` reference
   */
  getEvent(): ServerPlayerEvent {
    return this._event
  }

  /**
   * @returns `player` reference
   */
  getPlayer(): Player {
    return this._player
  }

  // Grouping?
  /**
   * Checks if at least on of the functions pass.
   * Resets `subject` back to `state` before each iteration
   */
  either(...args: (() => any)[]): this
  either(name: string, ...args: (() => any)[]): this
  either(nameOrFunc: string | (() => any), ...args: (() => any)[]): this {
    // TODO: early quit on first passing function.

    flag(this, "eitherLevel", flag(this, "eitherLevel") + 1)

    // At least one of these must pass
    const results = []
    let idx = 0

    const funcs = [...args]
    if (typeof nameOrFunc !== "string") {
      funcs.unshift(nameOrFunc)
    }
    const name = typeof nameOrFunc === "string" ? nameOrFunc : ""

    for (const test of funcs) {
      let error = null
      let result = true
      const level = flag(this, "eitherLevel")

      flag(this, "subject", this._state)
      resetNegation(this)

      try {
        logs.group(`either [${idx}] ${name}`)

        test()

        IS_CHROME
          ? logs.verbose(`[${idx}] -> %c✔︎`, iconStyle("green", "white"))
          : logs.verbose(`[${idx}] -> ${chalk.bgGreen.white(" ✔︎ ")}`)
        logs.groupEnd()
      } catch (i) {
        logs.verbose(`err:`, i.message)
        IS_CHROME
          ? logs.verbose(`[${idx}] -> %c✘`, iconStyle("red", "white"))
          : logs.verbose(`[${idx}] -> ${chalk.bgRed.white(" ✘ ")}`)
        logs.groupEnd()
        error = "  ".repeat(level) + i.message
        result = false
      }
      results.push({
        error,
        result
      })

      if (result) break

      idx++
    }
    flag(this, "eitherLevel", flag(this, "eitherLevel") - 1)

    if (results.every(({ result }) => result === false)) {
      throw new Error(
        [
          `either${name && ` '${name}'`} | none of the tests passed:`,
          ...results.map(({ error }) => error)
        ].join(`\n`)
      )
    }

    // Should it yield?
    return this
  }
}

export { Conditions }
