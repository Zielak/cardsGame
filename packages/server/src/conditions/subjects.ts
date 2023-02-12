import { isMapLike } from "@cardsgame/utils"

import type { Player } from "../index.js"
import type { QuerableProps } from "../queries/types.js"
import type { State } from "../state/state.js"
import { isChild } from "../traits/child.js"
import { hasOwnership } from "../traits/ownership.js"
import { isParent } from "../traits/parent.js"
import { hasSelectableChildren } from "../traits/selectableChildren.js"

import { throwError } from "./errors.js"
import {
  getFlag,
  getInitialSubject,
  getRef,
  resetPropDig,
  resetSubject,
  setFlag,
  setRef,
} from "./utils.js"

/**
 * Getters and methods which change subject
 */
class ConditionSubjects<InitialSubjects> {
  /**
   * Sets new subject. This can be anything.
   * @yields completely new subject, provided in the argument
   * @example
   * ```ts
   * con().set([1, 2, 3]).as("choices")
   * ```
   */
  set(newSubject: unknown): this {
    setFlag(this, "subject", newSubject)

    return this
  }

  /**
   * Looks for a child entity by their `props`, starting from current subject.
   *
   * @yields an entity, found by `QuerableProps` query
   * @example
   * ```ts
   * con().query({ name: "deck" }).not.empty()
   * ```
   */
  query(props: QuerableProps): this {
    // find new subject in current subject
    const parent =
      getFlag(this, "subject") === undefined
        ? getFlag(this, "state")
        : getFlag(this, "subject")

    if (!isParent(parent)) {
      throwError(
        this,
        `query(props) | current subject is not a parent: "${typeof parent}" = ${parent}`
      )
    }

    const newSubject = parent.query(props)

    setFlag(this, "subject", newSubject)

    resetPropDig(this)

    return this
  }

  /**
   * Allows you to change subject to one of the initial subjects.
   *
   * @example
   * ```ts
   * con().subject.entity.its("name").equals("mainDeck")
   * ```
   */
  get subject(): Record<keyof InitialSubjects, this> {
    const subjects = getFlag(this, "initialSubjects")
    const subjectNames = Object.keys(subjects)
    const properties = subjectNames.reduce((descriptor, subjectName) => {
      descriptor[subjectName] = {
        get: () => {
          setFlag(this, "subject", subjects[subjectName])
          return this
        },
      }

      return descriptor
    }, {} as PropertyDescriptorMap)

    return Object.defineProperties(
      {} as Record<keyof InitialSubjects, this>,
      properties
    )
  }

  /**
   * Alias to `con().subject`
   */
  get $(): Record<keyof InitialSubjects, this> {
    return this.subject
  }

  /**
   * Changes subject to a prop of its current subject.
   * @yields subject prop's value to be asserted. Will remember the reference to the object, so you can chain key checks
   * @example
   * ```ts
   * con().entity
   *   .its("propA").equals("foo")
   *   .and.its("propB").above(5)
   *
   * con().its("customMap").its("propA").equals(true)
   * ```
   */
  its(propName: string): this {
    setFlag(this, "propName", propName)
    setFlag(this, "currentParent", getFlag(this, "subject"))

    const currentParent = getFlag(this, "currentParent")

    if (isMapLike(currentParent)) {
      setFlag(this, "subject", currentParent.get(propName))
    } else {
      setFlag(this, "subject", currentParent[propName])
    }

    return this
  }

  /**
   * @yields parent of current subject
   */
  get parent(): this {
    const parent = getFlag(this, "subject").parent

    if (!parent) {
      throwError(this, `parent | Subject is the root state.`)
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
      throwError(this, `children | Current subject can't have children`)
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
        throwError(this, `nthChild | Out of bounds`)
      }

      setFlag(this, "subject", subject.getChild(index))
    } else if (Array.isArray(subject) || typeof subject.length === "number") {
      if (index > subject.length || index < 0) {
        throwError(this, `nthChild | Out of bounds`)
      }

      setFlag(this, "subject", subject[index])
    } else {
      throwError(this, `nthChild | Subject must be an array or Parent`)
    }

    return this
  }

  /**
   * @yields first element in collection
   */
  get bottom(): this {
    const subject = getFlag(this, "subject")

    if (typeof subject !== "object") {
      throwError(
        this,
        `bottom | Can't get the "bottom" of something other than an object`
      )
    }

    if (isParent(subject)) {
      setFlag(this, "subject", subject.getBottom())
    } else if ("length" in subject) {
      setFlag(this, "subject", subject[0])
    } else {
      throwError(this, `bottom | Couldn't decide how to get the "bottom" value`)
    }

    return this
  }

  /**
   * @yields last element in collection
   */
  get top(): this {
    const subject = getFlag(this, "subject")

    if (typeof subject !== "object") {
      throwError(
        this,
        `top | Can't get the "top" of something other than an object`
      )
    }

    if (isParent(subject)) {
      setFlag(this, "subject", subject.getTop())
    } else if ("length" in subject) {
      setFlag(this, "subject", subject[subject.length - 1])
    } else {
      throwError(this, `top | Couldn't decide how to get the "top" value`)
    }

    return this
  }

  /**
   * @yields {number} `length` property of a collection (or string)
   */
  get itsLength(): this {
    const subject = getFlag(this, "subject")

    if (subject.length === undefined) {
      throwError(this, `length | Subject doesn't have "length" property`)
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
      throwError(this, `selectedChildren | Expected subject to be parent`)
    }
    if (!hasSelectableChildren(subject)) {
      throwError(
        this,
        `selectedChildren | Subjects children are not selectable`
      )
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
      throwError(this, `unselectedChildren | Expected subject to be parent`)
    }
    if (!hasSelectableChildren(subject)) {
      throwError(
        this,
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
      throwError(this, `childrenCount | Expected subject to be a parent`)
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
      throwError(this, `childrenCount | Expected subject to be parent`)
    }
    if (!hasSelectableChildren(subject)) {
      throwError(this, `childrenCount | Subjects children are not selectable`)
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
      throwError(
        this,
        `unselectedChildrenCount | Expected subject to be parent`
      )
    }
    if (!hasSelectableChildren(subject)) {
      throwError(
        this,
        `unselectedChildrenCount | Subjects children are not selectable`
      )
    }

    const count = subject.countUnselectedChildren()
    setFlag(this, "subject", count)

    return this
  }

  /**
   * @yields {number} value of `idx` of the entity
   */
  get idx(): this {
    const subject = getFlag(this, "subject")

    if (!isChild(subject)) {
      throwError(this, `idx | Expected subject to be a child`)
    } else {
      setFlag(this, "subject", subject.idx)
    }

    return this
  }

  /**
   * @yields {number} value of `selectionIndex` of the entity
   */
  get selectionIndex(): this {
    const subject = getFlag(this, "subject")

    if (!isChild(subject)) {
      throwError(this, `selectionIndex | Expected subject to be a child`)
    } else if (!hasSelectableChildren(subject.parent)) {
      throwError(
        this,
        `selectionIndex | Parent without ability to select children`
      )
    } else {
      setFlag(this, "subject", subject.parent.getSelectionIndex(subject.idx))
    }

    return this
  }

  /**
   * **REQUIRES** `"player"` initial subject
   *
   * Changes subject to owner of current entity
   * @yields `player`
   */
  get owner(): this {
    const subject = getFlag(this, "subject")

    if (!isChild(subject) || !hasOwnership(subject)) {
      throwError(this, `owner | Expected subject to be ownable child`)
    } else {
      setFlag(this, "subject", subject.owner)
    }

    return this
  }

  /**
   * **REQUIRES** `"player"` initial subject
   *
   * Changes subject to entity of current dragging happening.
   * @yields `entity`
   */
  get playersDraggedEntity(): this {
    const player = getInitialSubject<Player>(this, "player")

    if (!player) {
      throwError(this, `playersDraggedEntity | Expected player in event`)
    } else {
      setFlag(
        this,
        "subject",
        getInitialSubject<Player>(this, "player").dragStartEntity
      )
    }

    return this
  }

  /**
   * Bring back previously remembered subject by its alias
   * @param alias
   *
   * @example
   * ```ts
   * con().query({ name: "deck" }).as("deck")
   * // ...
   * con().get("deck").children.not.empty()
   * ```
   */
  get(alias: string): this {
    const newSubject = getRef(this, alias)

    if (!newSubject) {
      throwError(this, `get | There's nothing under "${alias}" alias`)
    }

    setFlag(this, "subject", newSubject)

    return this
  }

  /**
   * Remembers subject found by queryProps with a given alias.
   * Won't start looking for (querying) new subject if given
   * alias is already populated with something (for performance!).
   *
   * @example
   * ```ts
   * con().remember("deck", { name: "deck" })
   * ```
   */
  remember(alias: string, props: QuerableProps): void {
    const currentAliasValue = getRef(this, alias)

    if (currentAliasValue) {
      // TODO: have _refs remember some query props in addition, so at least we have another way of comparing
      return
    }

    // find new subject in current subject
    const currentSubject = getFlag(this, "subject")
    const parent =
      currentSubject === undefined || !isParent(currentSubject)
        ? (getFlag(this, "state") as State)
        : currentSubject

    setRef(this, alias, parent.query(props))
  }

  /**
   * Remembers current subject with a given alias
   * @example
   * ```ts
   * con().as({ name: "deck" }).as("deck")
   * ```
   */
  as(alias: string): void {
    setRef(this, alias, getFlag(this, "subject"))

    resetSubject(this)
  }
}

export { ConditionSubjects }
