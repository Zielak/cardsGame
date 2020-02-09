import { logs, IS_CHROME, chalk } from "@cardsgame/utils"

import { State } from "../state"

import { iconStyle, flag, resetNegation } from "./utils"
import { Conditions } from "./conditions"

class ConditionGrouping<S extends State> {
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
      const con = new Conditions<S>(flag(this, "state"), flag(this, "event"))
      flag(con, "subject", item)
      predicate.call(con, con, item, index, subject)
    })

    return this
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

      flag(this, "subject", flag(this, "state"))
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

export { ConditionGrouping }
