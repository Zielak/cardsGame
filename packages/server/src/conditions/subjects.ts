import type { QuerableProps } from "../queryRunner"
import { isParent } from "../traits/parent"
import { hasSelectableChildren } from "../traits/selectableChildren"

import {
  getFlag,
  getInitialSubject,
  ref,
  resetPropDig,
  resetSubject,
  setFlag,
} from "./utils"

/**
 * Getters and methods which change subject
 */

class ConditionSubjects {
  /**
   * Sets new subject. This can be anything.
   * @yields completely new subject, provided in the argument
   */
  set(newSubject: unknown): this {
    setFlag(this, "subject", newSubject)

    return this
  }

  /**
   * Looks for a child entity by their `props`, starting from current subject.
   *
   * @yields an entity, found by alias or `QuerableProps` query
   * @example ```
   * con.state.get({name: 'deck'}).as('deck')
   * ```
   */
  get(props: QuerableProps): this
  /**
   * Changes subject to previously remembered entity by an `alias`,
   * or sone of the already remembered "initial subjects".
   * If `props` are also provided, it'll instead search the aliased entity
   * for another entity by their `props`.
   *
   * @yields an entity, found by alias or `QuerableProps` query
   * @example ```
   * con.get('deck', {rank: 'K'})
   * ```
   */
  get(alias: string, props?: QuerableProps): this
  get(arg0: string | QuerableProps, arg1?: QuerableProps): this {
    let newSubject
    if (typeof arg0 === "string") {
      const alias = arg0
      if (arg1) {
        // find child of aliased subject
        newSubject = ref(this, alias).query(arg1)
      } else {
        // get just subject by alias
        newSubject = ref(this, alias)
      }
    } else {
      // find new subject in current subject
      const parent =
        getFlag(this, "subject") === undefined
          ? getFlag(this, "state")
          : getFlag(this, "subject")

      if (!isParent(parent)) {
        throw new Error(
          `get(props) | current subject is not a parent: "${typeof parent}" = ${parent}`
        )
      }

      newSubject = parent.query(arg0)
    }

    setFlag(this, "subject", newSubject)

    resetPropDig(this)

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
  its(propName: string): this {
    const propParent = getFlag(this, "propParent")

    if (propParent) {
      setFlag(this, "subject", propParent[propName])
    } else {
      setFlag(this, "propParent", getFlag(this, "subject"))
      setFlag(this, "propName", propName)
      setFlag(this, "subject", getFlag(this, "propParent")[propName])
    }

    return this
  }

  /**
   * Remembers the subject with a given alias
   * @example
   * con.get({ name: 'deck' }).as('deck')
   */
  as(refName: string): void {
    ref(this, refName, getFlag(this, "subject"))

    resetSubject(this)
  }

  /**
   * @returns if there exists a reference to `subject` by the name of `refName`
   */
  hasReferenceTo(refName: string): boolean {
    return Boolean(ref(this, refName))
  }

  /**
   * @yields parent of current subject
   */
  get parent(): this {
    const parent = getFlag(this, "subject").parent

    if (!parent) {
      throw new Error(`parent | Subject is the root state.`)
    }
    setFlag(this, "subject", parent)

    return this
  }

  /**
   * @yields children of current subject (an array)
   */
  get children(): this {
    const parent = getFlag(this, "subject")

    if (!isParent(parent)) {
      throw new Error(`children | Current subject can't have children`)
    }

    const children = parent.getChildren()

    setFlag(this, "subject", children)

    return this
  }

  /**
   * @yields a child at a specific index (of array or Parent)
   * @param index
   */
  nthChild(index: number): this {
    const subject = getFlag(this, "subject")

    if (isParent(subject)) {
      if (index > subject.countChildren() || index < 0) {
        throw new Error(`nthChild | Out of bounds`)
      }

      setFlag(this, "subject", subject.getChild(index))
    } else if (Array.isArray(subject)) {
      if (index > subject.length || index < 0) {
        throw new Error(`nthChild | Out of bounds`)
      }

      setFlag(this, "subject", subject[index])
    } else {
      throw new Error(`nthChild | Subject must be an array or Parent`)
    }

    return this
  }

  /**
   * @yields first element in collection
   */
  get bottom(): this {
    const subject = getFlag(this, "subject")

    if (typeof subject !== "object") {
      throw new Error(
        `bottom | Can't get the "bottom" of something other than an object`
      )
    }

    if ("length" in subject) {
      setFlag(this, "subject", subject[0])
    } else if (isParent(subject)) {
      setFlag(this, "subject", subject.getBottom())
    } else {
      throw new Error(`bottom | Couldn't decide how to get the "bottom" value`)
    }

    return this
  }

  /**
   * @yields last element in collection
   */
  get top(): this {
    const subject = getFlag(this, "subject")

    if (typeof subject !== "object") {
      throw new Error(
        `top | Can't get the "top" of something other than an object`
      )
    }

    if ("length" in subject) {
      setFlag(this, "subject", subject[subject.length - 1])
    } else if (isParent(subject)) {
      setFlag(this, "subject", subject.getTop())
    } else {
      throw new Error(`top | Couldn't decide how to get the "top" value`)
    }

    return this
  }

  /**
   * @yields {number} `length` property of a collection (or string)
   */
  get itsLength(): this {
    const subject = getFlag(this, "subject")

    if (subject.length === undefined) {
      throw new Error(`length | Subject doesn't have "length" property`)
    }

    setFlag(this, "subject", subject.length)
    return this
  }

  /**
   * @yields all selected children
   */
  get selectedChildren(): this {
    const subject = getFlag(this, "subject")

    if (!isParent(subject)) {
      throw new Error(`selectedChildren | Expected subject to be parent`)
    }
    if (!hasSelectableChildren(subject)) {
      throw new Error(`selectedChildren | Subjects children are not selectable`)
    }

    setFlag(this, "subject", subject.getSelectedChildren())

    return this
  }

  /**
   * @yields all NOT selected children
   */
  get unselectedChildren(): this {
    const subject = getFlag(this, "subject")

    if (!isParent(subject)) {
      throw new Error(`unselectedChildren | Expected subject to be parent`)
    }
    if (!hasSelectableChildren(subject)) {
      throw new Error(
        `unselectedChildren | Subjects children are not selectable`
      )
    }

    setFlag(this, "subject", subject.getUnselectedChildren())

    return this
  }

  /**
   * @yields {number} children count if `subject` is a `Parent`
   */
  get childrenCount(): this {
    const subject = getFlag(this, "subject")

    if (!isParent(subject)) {
      throw new Error(`childrenCount | Expected subject to be a parent`)
    }

    const count = subject.countChildren()
    setFlag(this, "subject", count)

    return this
  }

  /**
   * @yields {number} number of selected children if subject is parent
   */
  get selectedChildrenCount(): this {
    const subject = getFlag(this, "subject")

    if (!isParent(subject)) {
      throw new Error(`childrenCount | Expected subject to be parent`)
    }
    if (!hasSelectableChildren(subject)) {
      throw new Error(`childrenCount | Subjects children are not selectable`)
    }

    const count = subject.countSelectedChildren()
    setFlag(this, "subject", count)

    return this
  }

  /**
   * @yields {number} number of selected children if subject is parent
   */
  get unselectedChildrenCount(): this {
    const subject = getFlag(this, "subject")

    if (!isParent(subject)) {
      throw new Error(`unselectedChildrenCount | Expected subject to be parent`)
    }
    if (!hasSelectableChildren(subject)) {
      throw new Error(
        `unselectedChildrenCount | Subjects children are not selectable`
      )
    }

    const count = subject.countUnselectedChildren()
    setFlag(this, "subject", count)

    return this
  }

  /**
   * **REQUIRES** `"player"` initial subject
   *
   * Changes subject to owner of current entity
   * @yields `player`
   */
  get owner(): this {
    setFlag(this, "subject", getInitialSubject(this, "player").owner)
    resetPropDig(this)

    return this
  }
}

export { ConditionSubjects }
