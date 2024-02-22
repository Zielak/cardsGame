import chalk from "chalk"

import { logs } from "../logs.js"
import type { State } from "../state/state.js"

import type { Conditions } from "./conditions.js"
import { throwError } from "./errors.js"
import { ConditionsContextBase } from "./types.js"
import { getFlag, resetNegation, setFlag } from "./utils.js"

type EitherCallback<C> = (con: C) => any
type EitherTuple<C> = [string, EitherCallback<C>]

class ConditionGrouping<
  Context extends ConditionsContextBase<S>,
  S extends State = Context["state"],
  C = Conditions<Context, S>,
> {
  /**
   * Loops through every item in subject's collection, executing provided function.
   * If one of the items fail any assertions, whole `every` block fails.
   *
   * Each item is automatically set as the `subject` within each iteration.
   * After all iterations are done, the `subject` will be reset back to what it originally was.
   *
   * @param predicate a function in style of native `array.forEach`,
   * but first argument is new Conditions instance.
   * This `con` will have its own subject set to each item of current subject.
   * @example
   * ```ts
   * con().get("chosenCards").children.every((con, item, index, array) => {
   *   con().its("rank").oneOf(["2", "3"])
   * })
   * ```
   * @yields back anything that was before `.every()` command so you can chain it further
   */
  every(
    predicate: (
      con: C,
      item: any,
      index: number | string,
      collection: any,
    ) => void,
  ): this {
    const subject = getFlag(this, "subject")

    if (!Array.isArray(subject)) {
      throwError(this, `each | Expected subject to be an array`)
    }

    const lastDefaultSubject = getFlag(this, "defaultSubject")

    subject.forEach((item, index) => {
      setFlag(this, "defaultSubject", item)
      setFlag(this, "subject", item)

      try {
        const con = getFlag(this, "_rootReference")
        predicate.call(con, con, item, index, subject)
      } catch (error) {
        setFlag(this, "defaultSubject", lastDefaultSubject)

        throw error
      }
    })

    setFlag(this, "defaultSubject", lastDefaultSubject)

    return this
  }

  /**
   * Loops through every item in subject's collection, executing provided function.
   * At least one item needs to pass tests for this whole block to pass.
   * If all items fail - whole block fails.
   *
   * Each item is automatically set as the `subject` within each iteration.
   * After all iterations are done, the `subject` will be reset back to what it originally was.
   *
   * @param predicate a function in style of native `array.some`,
   * but first argument is new Conditions instance.
   * This `con` will have its own subject set to each item of current subject.
   * @example
   * ```ts
   * con().set(chosenCards).some((con, item, index, array) => {
   *   con().its("rank").matchesPropOf(pileTop)
   * })
   * ```
   * @yields back the subject which was present before executing `.some()` command so you can chain it further.
   */
  some(
    predicate: (
      con: C,
      item: any,
      index: number | string,
      collection: any,
    ) => void,
  ): this {
    const subject = getFlag(this, "subject")

    if (!Array.isArray(subject)) {
      throwError(this, `some | Expected subject to be an array`)
    }

    const lastDefaultSubject = getFlag(this, "defaultSubject")

    const result = subject.some((item, index) => {
      setFlag(this, "defaultSubject", item)
      setFlag(this, "subject", item)

      try {
        const con = getFlag(this, "_rootReference")
        predicate.call(con, con, item, index, subject)
        // Ok, this one didn't fail, `some` block succeeds
        return true
      } catch (_) {
        // This one failed, try another one
        return false
      }
    })

    setFlag(this, "defaultSubject", lastDefaultSubject)

    if (!result) {
      throwError(this, `some | all of the functions failed.`)
    }

    return this
  }

  /**
   * Checks if at least one of the functions pass.
   * Resets `subject` back to `state` before each iteration.
   *
   * Effectively works like `OR` in logical operations
   *
   * @example
   * ```ts
   * // Will pass with the first statement and ignore the rest
   * con().either(
   *   () => con().set(1).equals(1),
   *   () => con().set(0).equals(1),
   *   () => con().set(0).equals(1)
   * )
   *
   * // Both statements fail, will throw with top message: "none passed"
   * con("none passed").either(
   *   () => con("zero is one").set(0).equals(1),
   *   () => con("one is two").set(1).equals(2)
   * )
   * ```
   */
  either(
    groupName: string,
    ...args: (EitherCallback<C> | EitherTuple<C>)[]
  ): this
  either(...args: (EitherCallback<C> | EitherTuple<C>)[]): this
  either(
    nameOrFunc: string | (EitherCallback<C> | EitherTuple<C>),
    ...args: (EitherCallback<C> | EitherTuple<C>)[]
  ): this {
    // TODO: early quit on first passing function.

    const eitherLevel = getFlag(this, "eitherLevel") + 1
    setFlag(this, "eitherLevel", eitherLevel)

    // At least one of these must pass
    const results = []

    const funcs: EitherTuple<C>[] = [...args].map((value) => {
      if (!Array.isArray(value)) {
        return ["", value]
      }
      return value
    })

    if (typeof nameOrFunc !== "string") {
      if (Array.isArray(nameOrFunc)) {
        funcs.unshift(nameOrFunc)
      } else {
        funcs.unshift(["", nameOrFunc])
      }
    }
    const groupName = typeof nameOrFunc === "string" ? nameOrFunc : ""

    logs.group(`either ${chalk.white.italic(groupName)}`)

    let idx = 0
    for (const [name, test] of funcs) {
      let error = null
      let result = true
      const testName = name ? `"${chalk.italic(name)}" ` : ""

      setFlag(this, "subject", getFlag(this, "state"))
      resetNegation(this)

      const prefix = idx < funcs.length - 1 ? "╞╴" : "╘╴"

      try {
        test(this as unknown as C)

        logs.log(
          `${prefix}[${idx}] ${testName}-> ${chalk.bgGreen.white(" ✔︎ ")}`,
        )
      } catch (i) {
        logs.debug(`err:`, i.message)

        logs.log(`${prefix}[${idx}] ${testName}-> ${chalk.bgRed.white(" ✘ ")}`)
        error = "  ".repeat(eitherLevel) + i.message
        result = false
      }
      results.push({
        error,
        result,
      })

      if (result) {
        break
      }

      idx++
    }
    logs.groupEnd()
    setFlag(this, "eitherLevel", eitherLevel - 1)

    if (results.every(({ result }) => result === false)) {
      const quotedGroupName = groupName ? ` "${groupName}"` : ""
      throwError(
        this,
        [
          `either${quotedGroupName} | none of the tests passed:`,
          ...results.map(({ error }) => error),
        ].join(`\n`),
      )
    }

    // Should it yield?
    return this
  }
}

export { ConditionGrouping }
