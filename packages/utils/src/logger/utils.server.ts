import Chalk from "chalk"

import { minifyEntity } from "./utils.js"

export const chalk = new Chalk.Instance({
  level: 1,
})

export const syntaxHighlight = (arg: any): any => {
  if (typeof arg === "string") {
    return chalk.gray(arg)
  }
  if (typeof arg === "number") {
    return chalk.red.bold(arg.toString())
  }
  if (typeof arg === "boolean") {
    return chalk.green.bold(arg.toString())
  }
  // It must be some Entity
  if (arg && arg._state) {
    return chalk.yellow(minifyEntity(arg))
  }
  return arg
}
