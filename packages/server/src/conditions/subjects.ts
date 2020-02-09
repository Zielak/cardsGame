import { flag, resetPropDig, resetSubject, ref } from "./utils"
import { hasSelectableChildren } from "../traits/selectableChildren"
import { isParent } from "../traits/parent"
import { QuerableProps } from "../queryRunner"

/**
 * Getters and methods which change subject
 */

class ConditionSubjects {
  /**
   * Changes subject to game's state
   * @yields `state`
   */
  get state(): this {
    resetSubject(this)
    resetPropDig(this)

    return this
  }

  /**
   * Changes subject to a player of current interaction
   * @yields `player` of current interaction
   */
  get player(): this {
    flag(this, "subject", flag(this, "player"))
    resetPropDig(this)

    return this
  }

  /**
   * Changes subject to interacted entity
   * @yields `entity` from players interaction
   */
  get entity(): this {
    flag(this, "subject", flag(this, "entity"))
    resetPropDig(this)

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
        newSubject = ref(this, alias).query(arg1)
      } else {
        // get just subject by alias
        newSubject = ref(this, alias)
      }
    } else {
      // find subject in State tree
      newSubject = flag(this, "state").query(arg0)
    }

    flag(this, "subject", newSubject)

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
    const propParent = flag(this, "propParent")

    if (propParent) {
      flag(this, "subject", propParent[propName])
    } else {
      flag(this, "propParent", flag(this, "subject"))
      flag(this, "propName", propName)
      flag(this, "subject", flag(this, "propParent")[propName])
    }

    return this
  }

  /**
   * Remembers the subject with a given alias
   * @example ```
   * con.get({name: 'deck'}).as('deck')
   * ```
   */
  as(refName: string | symbol): void {
    ref(this, refName, flag(this, "subject"))

    resetSubject(this)
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
}

export { ConditionSubjects }
