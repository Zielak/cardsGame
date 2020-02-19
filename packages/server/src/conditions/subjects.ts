import { getFlag, setFlag, resetPropDig, resetSubject, ref } from "./utils"
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
    setFlag(this, "subject", getFlag(this, "player"))
    resetPropDig(this)

    return this
  }

  /**
   * Changes subject to interacted entity
   * @yields `entity` from players interaction
   */
  get entity(): this {
    setFlag(this, "subject", getFlag(this, "entity"))
    resetPropDig(this)

    return this
  }

  /**
   * Changes subject to interaction data,
   * throws if it wasn't provided by the client.
   * @yields `data` from players interaction
   */
  get data(): this {
    setFlag(this, "subject", getFlag(this, "data"))
    resetPropDig(this)

    return this
  }

  /**
   * Sets new subject. This can be anything.
   * @yields completely new subject, provided in the argument
   */
  set(newSubject): this {
    setFlag(this, "subject", newSubject)

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
      newSubject = getFlag(this, "state").query(arg0)
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
   * @example ```
   * con.get({name: 'deck'}).as('deck')
   * ```
   */
  as(refName: string | symbol): void {
    ref(this, refName, getFlag(this, "subject"))

    resetSubject(this)
  }

  /**
   * @yields children of current subject
   */
  get children(): this {
    const children = getFlag(this, "subject").getChildren()

    setFlag(this, "subject", children)

    return this
  }

  /**
   * @yields a child at a specific index (array or Parent)
   * @param index
   */
  nthChild(index: number): this {
    const subject = getFlag(this, "subject")

    if (typeof subject !== "object") {
      throw new Error(`nthChild | Subject must be an object`)
    }

    if (isParent(subject)) {
      setFlag(this, "subject", subject.getChild(index))
    } else {
      setFlag(this, "subject", subject[index])
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
  get length(): this {
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
   * @yields all selected children
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
}

export { ConditionSubjects }
