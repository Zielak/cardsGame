import { chalk, IS_CHROME, logs } from "@cardsgame/utils"

import { Conditions } from "./conditions"
import {
  cloneConditions,
  getFlag,
  iconStyle,
  resetNegation,
  setFlag,
} from "./utils"

type EitherCallback = () => any
type EitherTuple = [string, EitherCallback]

class ConditionGrouping<S, C extends Conditions<S>> {
  /**
   * Loops through every item in subject's collection, executing provided function.
   * If one of the items fail any assertions, whole `every` block fails.
   *
   * Each item is automatically set as the `subject` within each iteration.
   * After all iterations are done, the `subject` will be reset back to what it originally was.
   *
   * @param predicate a function in style of native `array.forEach`, but first argument is new Conditions instance. This `con` will have its own subject set to each item of current subject.
   * @example
   * con.get("chosenCards").children.every((con, item, index, array) => {
   *   con.its("rank").oneOf(["2", "3"])
   * })
   * @yields back anything that was before `.every()` command so you can chain it further
   */
  every(
    predicate: (
      con: C,
      item: any,
      index: number | string,
      collection: any
    ) => void
  ): this {
    const subject = getFlag(this, "subject")

    if (!Array.isArray(subject)) {
      throw new Error(`each | Expected subject to be an array`)
    }

    subject.forEach((item, index) => {
      const con = cloneConditions<C>(this)
      setFlag(con, "subject", item)
      predicate.call(con, con, item, index, subject)
    })

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
   * @param predicate a function in style of native `array.some`, but first argument is new Conditions instance. This `con` will have its own subject set to each item of current subject.
   * @example
   * con.get("chosenCards").children.some((con, item, index, array) => {
   *   con.its("rank").matchesPropOf("pileTop")
   * })
   * @yields back anything that was before `.some()` command so you can chain it further
   */
  some(
    predicate: (
      con: C,
      item: any,
      index: number | string,
      collection: any
    ) => void
  ): this {
    const subject = getFlag(this, "subject")

    if (!Array.isArray(subject)) {
      throw new Error(`some | Expected subject to be an array`)
    }

    const result = subject.some((item, index) => {
      const con = cloneConditions<C>(this)
      setFlag(con, "subject", item)
      try {
        predicate.call(con, con, item, index, subject)
        // Ok, this one didn't fail, `some` block succeeds
        return true
      } catch (_) {
        // This one failed, try another one
        return false
      }
    })

    if (!result) {
      throw new Error(`some | all of the functions failed.`)
    }

    return this
  }

  /**
   * Checks if at least one of the functions pass.
   * Resets `subject` back to `state` before each iteration
   */
  either(groupName: string, ...args: (EitherCallback | EitherTuple)[]): this
  either(...args: (EitherCallback | EitherTuple)[]): this
  either(
    nameOrFunc: string | (EitherCallback | EitherTuple),
    ...args: (EitherCallback | EitherTuple)[]
  ): this {
    // TODO: early quit on first passing function.

    const eitherLevel = getFlag(this, "eitherLevel") + 1
    setFlag(this, "eitherLevel", eitherLevel)

    // At least one of these must pass
    const results = []

    const funcs: EitherTuple[] = [...args].map((value) => {
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
        test()

        IS_CHROME
          ? logs.notice(
              `${prefix}[${idx}] ${testName}-> %c✔︎`,
              iconStyle("green", "white")
            )
          : logs.notice(
              `${prefix}[${idx}] ${testName}-> ${chalk.bgGreen.white(" ✔︎ ")}`
            )
      } catch (i) {
        logs.verbose(`err:`, i.message)
        IS_CHROME
          ? logs.notice(
              `${prefix}[${idx}] ${testName}-> %c✘`,
              iconStyle("red", "white")
            )
          : logs.notice(
              `${prefix}[${idx}] ${testName}-> ${chalk.bgRed.white(" ✘ ")}`
            )
        error = "  ".repeat(eitherLevel) + i.message
        result = false
      }
      results.push({
        error,
        result,
      })

      if (result) break

      idx++
    }
    logs.groupEnd()
    setFlag(this, "eitherLevel", eitherLevel - 1)

    if (results.every(({ result }) => result === false)) {
      throw new Error(
        [
          `either${
            groupName ? ` "${groupName}"` : ""
          } | none of the tests passed:`,
          ...results.map(({ error }) => error),
        ].join(`\n`)
      )
    }

    // Should it yield?
    return this
  }
}

export { ConditionGrouping }
