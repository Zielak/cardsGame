import { State } from "./state"
import { ServerPlayerEvent, Player } from "./player"
import { QuerableProps, find, getChildren } from "./traits"

// export interface ExpandableConditions<S extends State> {
//   [key: string]: (this: Conditions<S>) => Conditions<S>
// }

export type ConditionsConstructor<
  S extends State,
  R extends Conditions<S>
> = new (state: S, event: ServerPlayerEvent) => R

class Conditions<S extends State> /* implements IConditions<S> */ {
  private _state: S
  private _event: ServerPlayerEvent
  private get _player() {
    return this._event.player
  }

  private _subject: any
  private _propParent: any
  private _propName: any
  private _refs = new Map<string | Symbol, any>()
  private _not = false

  constructor(state: S, event: ServerPlayerEvent) {
    this._state = state
    this._event = event

    this._subject = this.state

    // for (const key in more) {
    //   if (more.hasOwnProperty(key)) {
    //     this[key] = more[key]
    //   }
    // }
  }

  private _check = {
    // These shouldn't care about `_not`!
    // Don't make it negate multiple times in one assertion
    /**
     * Compare without coercion, one value to another.
     */
    equal(actual, expected) {
      const not = this._not

      if (not ? actual === expected : actual !== expected) {
        throw new Error(`${actual} ${not ? "===" : "!=="} ${expected}`)
      }
    },

    /**
     * Loosely compare.
     */
    // equal(actual, expected) {
    //   if (actual != expected) {
    //     throw new Error(`${actual} != ${expected}`)
    //   }
    // },

    truthy(actual) {
      const not = this._not

      if (!not && !Boolean(actual)) {
        throw new Error(`${actual} is not truthy`)
      }
      if (not && Boolean(actual)) {
        throw new Error(
          `${actual} is truthy but shouldn't be (not).\nPS: don't negate truthy 😰, use \`falsy()\` instead.`
        )
      }
    },
    falsy(actual) {
      const not = this._not

      if (!not && Boolean(actual)) {
        throw new Error(`${actual} is not falsy`)
      }
      if (not && !Boolean(actual)) {
        throw new Error(
          `${actual} is not falsy but shouldn't be (.not).\nPS: don't negate falsy 😰, use \`truthy()\` instead.`
        )
      }
    },

    // (5).above(10)
    // (5).above(5)
    // (5).above(0)
    // (5).not.above(0)
    // (5).not.above(5)
    // (5).not.above(10)
    above(actual, expected) {
      const not = this._not

      if (!not && actual < expected) {
        throw new Error(`actual ${actual} is NOT above ${expected}`)
      }
      if (not && actual > expected) {
        throw new Error(
          `actual ${actual} is above ${expected}, but shouldn't (.not)`
        )
      }
    },

    // (5).below(10)
    // (5).below(5)
    // (5).below(0)
    // (5).not.below(0)
    // (5).not.below(5)
    // (5).not.below(10)
    below(actual, expected) {
      const not = this._not

      if (!not && actual > expected) {
        throw new Error(`actual ${actual} is NOT below ${expected}`)
      }
      if (not && actual < expected) {
        throw new Error(
          `actual ${actual} is below ${expected} but shouldn't (not)`
        )
      }
    }
  }

  private _wrapError(callback: Function, message: string) {
    try {
      callback()
    } catch (i) {
      throw new Error(`${message}\n${i}`)
    }
  }

  private postAssertion() {
    this._not = false

    if (this._propParent) {
      // Reset subject to the object, if we were
      // just asserting its key value
      this._subject = this._propParent
      this._propParent = undefined
      this._propName = undefined
    }
  }
  private resetPropDig() {
    this._propParent = undefined
    this._propName = undefined
  }

  get not(): this {
    this._not = true
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
    this._subject = this._state
    this.resetPropDig()

    return this
  }
  /**
   * @yields `player` of current interaction
   */
  get player(): this {
    this._subject = this._player
    this.resetPropDig()

    return this
  }
  /**
   * @yields `entity` from players interaction
   */
  get entity(): this {
    this._subject = this._event.entity
    this.resetPropDig()

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
    if (typeof alias === "string") {
      if (args.length > 0) {
        this._subject = find(this._refs.get(alias), args)
      } else {
        // get subject by alias
        this._subject = this._refs.get(alias)
      }
    } else {
      this._subject = find(this._state, [alias, ...args])
    }
    this.resetPropDig()

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
    this._propParent = this._subject
    this._propName = key
    this._subject = this._subject[key]

    return this
  }

  /**
   * Remembers the subject with a given alias
   */
  as(ref: string | Symbol): void {
    this._refs.set(ref, this._subject)
  }

  /**
   * @yields children of current subject
   */
  get children(): this {
    this._subject = getChildren(this._subject)

    return this
  }
  /**
   * @yields first element in collection
   */
  get first(): this {
    this._subject = this._subject[0]

    return this
  }
  /**
   * @yields last element in collection
   */
  get last(): this {
    this._subject = this._subject[this._subject.length - 1]

    return this
  }
  /**
   * @yields `length` property of a collection (or string)
   */
  get length(): this {
    this._subject = this._subject.length
    return this
  }

  /**
   * Loops through every item in subject's collection.
   * Each item is set as the `subject` with each iteration automatically.
   * After all iterations are done, the `subject` will be reset back to what it originally was.
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
    // Remember current subject
    const subject = this._subject
    for (const [key, item] of subject) {
      this._subject = item
      predicate.call(this, item, key, subject)
    }

    // Revert subject, and go back to chaining
    this._subject = subject
    this.postAssertion()

    return this
  }

  // Commands?
  // Throw when assertion doesn't pass
  equals(value: any): this {
    this._check.equal(this._subject, value)
    this.postAssertion()

    return this
  }
  above(value: number): this {
    this._check.above(this._subject, value)
    this.postAssertion()

    return this
  }
  below(value: number): this {
    this._check.below(this._subject, value)
    this.postAssertion()

    return this
  }
  oneOf(values: any[]): this {
    const result = values.some(val => this._check.equal(this._subject, val))

    if (!result) {
      throw new Error(
        `oneOf | "${this._subject}" didn't match any of [${values.join(", ")}]`
      )
    }
    return this
  }
  lengthOf(value: number): this {
    this._check.equal(this._subject.length, value)
    this.postAssertion()

    return this
  }
  matchesPropOf(ref: string | Symbol): this {
    // TODO: accept queryProps?
    if (!this._propParent) {
      throw new Error(
        "matchesPropOf | needs to be preceded with `its` to pick a prop name"
      )
    }
    const expected = this._refs.get(ref)[this._propName]
    this._check.equal(this._subject, expected)

    this.postAssertion()

    return this
  }

  /**
   * Based on `state` instead of `subject`
   */
  get playersTurn(): this {
    const { currentPlayer } = this._state
    this._check.equal(this._player, currentPlayer)

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

    this.postAssertion()
    return this
  }

  // Assertions?
  /**
   * Subject should be empty
   * lol, works for strings aswell
   */
  get empty(): this {
    if ("length" in this._subject) {
      this._wrapError(
        () => this._check.equal(this._subject.length, 0),
        ".empty | subject (iterable) has some items."
      )
    } else if (typeof this._subject === "object") {
      this._wrapError(
        () => this._check.equal(Object.keys(this._subject).length, 0),
        ".empty | subject (object) has some items"
      )
    } else {
      throw new Error(`.empty | given non-iterable subject: "${this._subject}"`)
    }
    this.postAssertion()
    return this
  }
  /**
   * Based on `event` instead of `subject`
   */
  get owner(): this {
    this._check.equal(this._player, this._event.entity.owner)

    return this
  }

  // getValue() {
  //   return this._subject
  // }
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

      this._subject = this._state

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
