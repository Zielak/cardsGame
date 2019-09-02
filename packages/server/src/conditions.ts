import { State } from "./state"
import { ServerPlayerEvent, Player } from "./player"
import {
  QuerableProps,
  find,
  getChildren,
  getOwner,
  countChildren,
  getBottom,
  getTop
} from "./traits"
import { logs, IS_CHROME } from "@cardsgame/utils"
import chalk from "chalk"

// export interface ExpandableConditions<S extends State> {
//   [key: string]: (this: Conditions<S>) => Conditions<S>
// }

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

const ensure = (expression, errorMessage) => {
  if (!expression) {
    throw new Error(errorMessage)
  }
}

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
  _refs = new Map<string | Symbol, any>()

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
   * @param errMessageNot use #{exp} and #{act} to inject values in error messages
   * @param expected
   * @param actual
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

  get not(): this {
    flag(this, "not", true)
    return this
  }

  // Chainers
  // prettier-ignore
  get has(): this { return this }
  // prettier-ignore
  get to(): this { return this }
  // prettier-ignore
  get is(): this { return this }
  // prettier-ignore
  get be(): this { return this }
  // prettier-ignore
  get and(): this { return this }

  // Subject changer
  /**
   * @yields `state`
   */
  get state(): this {
    flag(this, "subject", this._state)
    this._resetPropDig()

    return this
  }
  /**
   * @yields `player` of current interaction
   */
  get player(): this {
    flag(this, "subject", this._player)
    this._resetPropDig()

    return this
  }
  /**
   * @yields `entity` from players interaction
   */
  get entity(): this {
    flag(this, "subject", this._event.entity)
    this._resetPropDig()

    return this
  }
  /**
   * @yields completely new subject, provided in the argument
   */
  set(newSubject): this {
    flag(this, "subject", newSubject)

    return this
  }
  /**
   * @yields an entity, found by alias or `QuerableProps` query
   * @example ```
   * get({name: 'deck'}).as('deck')
   * get('deck')
   * get('deck', {rank: 'K'})
   * ```
   */
  get(alias: string | Symbol | QuerableProps, ...args: QuerableProps[]): this {
    let newSubject
    if (typeof alias === "string") {
      if (args.length > 0) {
        // find child of subject by alias
        newSubject = find(this._refs.get(alias), args)
      } else {
        // get subject by alias
        newSubject = this._refs.get(alias)
      }
    } else {
      // find subject in State tree
      newSubject = find(this._state, alias, ...args)
    }

    flag(this, "subject", newSubject)

    this._resetPropDig()

    return this
  }
  /**
   * @yields subjects key to be asserted. Will remember the reference to the object, so you can chain key checks
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
   */
  as(ref: string | Symbol): void {
    this._refs.set(ref, flag(this, "subject"))

    flag(this, "subject", this._state)
  }

  /**
   * @yields children of current subject
   */
  get children(): this {
    const children = getChildren(flag(this, "subject"))

    flag(this, "subject", children)

    return this
  }
  /**
   * @yields first element in collection
   */
  get bottom(): this {
    const subject = flag(this, "subject")

    ensure(
      typeof subject === "object",
      `bottom | Can't get the "bottom" of something else than an object`
    )

    if ("length" in subject) {
      flag(this, "subject", subject[0])
    } else {
      flag(this, "subject", getBottom(subject))
    }

    return this
  }
  /**
   * @yields last element in collection
   */
  get top(): this {
    const subject = flag(this, "subject")

    ensure(
      typeof subject === "object",
      `top | Can't get the "top" of something else than an object`
    )

    if ("length" in subject) {
      flag(this, "subject", subject[subject.length - 1])
    } else {
      flag(this, "subject", getTop(subject))
    }

    return this
  }
  /**
   * @yields `length` property of a collection (or string)
   */
  get length(): this {
    const subject = flag(this, "subject")

    ensure(
      subject.length !== undefined,
      `length | Subject doesn't have "length" property`
    )

    flag(this, "subject", subject.length)
    return this
  }
  /**
   * @yields children count if `subject` is a `Parent`
   */
  get childrenCount(): this {
    const subject = flag(this, "subject")

    ensure(
      typeof subject === "object",
      `childrenCount | Expected "subject" to be an object`
    )

    const count = countChildren(flag(this, "subject"))
    flag(this, "subject", count)

    return this
  }

  /**
   * Loops through every item in subject's collection.
   * Each item is set as the `subject` with each iteration automatically.
   * After all iterations are done, the `subject` will be reset back to what it originally was.
   * If one of the items fail any assertions, whole `each` block fails.
   * @param predicate a function in style of native `array.forEach`, but first argument is new Conditions instance. This `con` will have its own subject set to each item of current subject.
   * @example
   * con.get("chosenCards").children.each((con, item, index, array) => {
   *   con.its("rank").oneOf(["2", "3"])
   * })
   * @yields anything that was before `.each()` command
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

    ensure(Array.isArray(subject), `each | Expected subject to be an array`)

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
   * @asserts that subject is equal to provided value. No coercion.
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
    const count = countChildren(subject)

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
   * @asserts that subject's length is equal to expected.
   */
  lengthOf(value: number): this {
    const subject = flag(this, "subject")

    ensure(
      typeof subject === "object",
      `lengthOf | Subject expected to be an object (typeof)`
    )

    this.assert(
      subject.length === value,
      `subject[#{act}] doesn't contain exactly #{exp} items`,
      `subject[#{act}] contains exactly #{exp}, but shouldn't`,
      value,
      subject.length
    )

    return this
  }
  /**
   * @asserts
   */
  matchesPropOf(ref: string | Symbol): this {
    // TODO: accept queryProps?

    ensure(
      this._propParent,
      `matchesPropOf | Needs to be preceded with ".its" to pick a prop name`
    )

    const subject = flag(this, "subject")
    const expected = this._refs.get(ref)[this._propName]

    this.assert(
      subject === expected,
      `subject's '${this._propName}' (#{act}) doesn't match with the same prop at '${ref}' (#{exp})`,
      `subject's '${this._propName}' (#{act}) is equal with prop of '${ref}', but shouldn't (#{exp})`,
      expected,
      subject
    )

    return this
  }

  /**
   * Based on `state` instead of `subject`
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
   * Based on `state` instead of `subject`
   * Current player has a specific UI element presented to him.
   * If `uiKey` is left empty, function will test if player
   * has ANY ui interface open.
   * @asserts
   * @example
   * con.revealedUI() // player has ANY UI revealed
   * con.not.revealedUI() // player doesn't have ANY UI revealed
   * con.revealedUI("rankChooser") // player has "rankChooser" revealed
   * con.not.revealedUI("rankChooser") // player doesn't have "rankChooser" revealed
   */
  revealedUI(uiKey?: string): this {
    const { ui } = this._state

    if (uiKey) {
      // 1. uiKey needs to exist
      ensure(
        uiKey in ui,
        `revealedUI | this UI doens't have "${uiKey}" key defined`
      )

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

    ensure(
      (typeof subject === "object" && subject !== null) ||
        typeof subject === "string",
      `.empty | Given an invalid subject: ${subject}`
    )

    if (subject.length !== undefined) {
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
    } else if (typeof subject === "object") {
      this.assert(
        Object.keys(subject).length === 0,
        `subject ${propName}(object) has some items.`,
        `subject ${propName}(object) is empty, but shouldn't.`
      )
    }

    return this
  }

  /**
   * Based on `event` instead of `subject`
   * @asserts
   */
  get owner(): this {
    const expected = getOwner(this._event.entity)

    this.assert(
      this._player === expected,
      `Player is not an owner`,
      `Player is an owner, but shouldn't`
    )

    return this
  }

  /**
   * @returns `state` reference
   */
  getState(): S {
    return this._state
  }
  /**
   * @returns `event` reference
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
