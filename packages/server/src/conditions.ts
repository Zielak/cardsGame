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
import { logs } from "@cardsgame/utils"

// export interface ExpandableConditions<S extends State> {
//   [key: string]: (this: Conditions<S>) => Conditions<S>
// }

export type ConditionsConstructor<
  S extends State,
  R extends Conditions<S>
> = new (state: S, event: ServerPlayerEvent) => R

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
  if (target._flags.get("not")) logs.info("resetNegation")
  target._flags.set("not", false)
}

const getMessage = (target, args) => {
  const not = flag(target, "not")
  const [result, message, messageNot, expected, actual] = args

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
  }

  /**
   *
   * @param result
   * @param message use #{exp} and #{act} to inject values in error messages
   * @param messageNot use #{exp} and #{act} to inject values in error messages
   * @param expected
   * @param actual
   */
  assert(
    result: boolean,
    message: string,
    messageNot?: string,
    expected?,
    actual?
  ) {
    const not = flag(this, "not")
    const ok = not ? !result : result

    if (!ok) {
      const msg = getMessage(this, arguments)

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
    logs.warn("NOT", "set to true")
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
   * @param predicate a function in style of native `array.forEach`. Its arguments are optional.
   * @example
   * con.get("chosenCards").children.each(() => {
   *   con.its("rank").oneOf(["2", "3"])
   * })
   * @yields anything that was before `.each()` command
   */
  each(
    predicate: (item: any, index: number | string, collection: any) => void
  ): this {
    const subject = flag(this, "subject")

    ensure(Array.isArray(subject), `each | Expected subject to be an array`)

    subject.forEach((item, index) => {
      flag(this, "subject", item)
      resetNegation(this)
      this._resetPropDig()
      predicate.call(this, item, index, subject)
    })

    // Revert subject, and go back to chaining
    flag(this, "subject", subject)
    resetNegation(this)
    this._postAssertion()

    return this
  }

  // Commands?
  // Throw when assertion doesn't pass
  equals(value: any): this {
    const not = flag(this, "not"),
      subject = flag(this, "subject")

    this.assert(
      !not ? subject === value : subject !== value,
      `expected #{act} to equal #{exp}`,
      `expected #{act} to NOT equal #{exp}`,
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
  above(value: number): this {
    const subject = flag(this, "subject")

    this.assert(
      subject > value,
      `expected #{exp} to be above #{act}`,
      `expected #{exp} to be below #{act}`,
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
  below(value: number): this {
    const subject = flag(this, "subject")

    this.assert(
      subject < value,
      `expected #{exp} to be below #{act}`,
      `expected #{exp} to be above #{act}`,
      value,
      subject
    )

    return this
  }
  /**
   * @asserts
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
   * @asserts
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
      `subject's ${this._propName} doesn't match with the same prop at ${ref}`,
      `subject's ${this._propName} is equal with prop of ${ref}, but shouldn't`,
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
   */
  revealedUI(UInames: string | string[]): this {
    const { ui } = this._state
    const names = Array.isArray(UInames) ? UInames : [UInames]
    // const uiSubjects = Object.keys(ui).filter(uiKey => names.includes(uiKey))

    // Client needs to be in every UI key
    names.every(uiKey => {
      // 1. uiKey needs to exist
      if (!(uiKey in ui)) {
        throw new Error(`revealedUI | this UI doens't have "${uiKey}"`)
      }

      // 2. Current client has to be on the list
      const uiValues = Array.isArray(ui[uiKey]) ? ui[uiKey] : [ui[uiKey]]
      return uiValues.some(client => this._player.clientID === client)
    })

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

    ensure(
      (typeof subject === "object" && subject !== null) ||
        typeof subject === "string",
      `.empty | Given an invalid subject: ${subject}`
    )

    if (subject.length !== undefined) {
      this.assert(
        subject.length === 0,
        "subject (iterable) has some items.",
        "subject (iterable) is empty, but shouldn't."
      )
    } else if ("size" in subject) {
      this.assert(
        subject.size === 0,
        "subject (map/set) has some items.",
        "subject (map/set) is empty, but shouldn't."
      )
    } else if (typeof subject === "object") {
      this.assert(
        Object.keys(subject).length === 0,
        "subject (object) has some items.",
        "subject (object) is empty, but shouldn't."
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
  either(...args: (() => any)[]): this {
    // TODO: early quit on first passing function.

    // At least one of these must pass
    const results = args.map(test => {
      let error = null
      let result = true

      flag(this, "subject", this._state)
      resetNegation(this)

      try {
        test()
      } catch (i) {
        error = i
        result = false
      }
      return {
        error,
        result
      }
    })
    if (results.every(({ result }) => result === false)) {
      throw new Error(
        [
          "either | none of the tests passed:",
          ...results.map(({ error }) => error)
        ].join(`\n`)
      )
    }

    // Should it yield?
    return this
  }
}

export { Conditions }
