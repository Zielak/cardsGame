import { Logger } from "../baseLogger.js"
import { setLogLevel } from "../logLevel.js"
import { LogsExport } from "../types.js"

import { chalk, syntaxHighlight } from "./utils.js"

/**
 * `Chalk` instance used internally by server-side lib.
 */

const { LOGS } = process.env
setLogLevel(LOGS === "true" ? "notice" : "" + LOGS)

export const globalIndent = new Logger()

export const serverLogs: LogsExport = {
  verbose: function (...args: any[]): void {
    console.debug.apply(console, [
      globalIndent.getIndent(),
      `\t`,
      ...args.map((arg) => chalk.gray(arg)),
    ])
  },
  debug: function (...args: any[]): void {
    console.debug.apply(console, [
      globalIndent.getIndent(),
      `\t`,
      ...args.map((arg) => chalk.gray(arg)),
    ])
  },
  notice: function (first, ...args: any[]): void {
    if (args.length > 0) {
      console.log.apply(console, [
        globalIndent.getIndent(),
        `${first}:`,
        ...args.map(syntaxHighlight),
      ])
    } else {
      console.log.call(console, chalk.gray(globalIndent.getIndent() + first))
    }
  },
  log: function (first, ...args: any[]): void {
    if (args.length > 0) {
      console.log.apply(console, [
        globalIndent.getIndent(),
        `${first}:`,
        ...args.map(syntaxHighlight),
      ])
    } else {
      console.log.call(console, chalk.gray(globalIndent.getIndent() + first))
    }
  },
  info: function (first, ...args: any[]): void {
    console.info.apply(console, [
      globalIndent.getIndent() + chalk.bgBlue.black(` ${first} `),
      ...args.map(syntaxHighlight),
    ])
  },
  warn: function (first, ...args: any[]): void {
    console.warn.apply(console, [
      globalIndent.getIndent() + chalk.bgYellow.black(` ${first} `),
      ...args.map(syntaxHighlight),
    ])
  },
  error: function (first, ...args: any[]): void {
    console.error.apply(console, [
      globalIndent.getIndent() + chalk.bgRed.white(` ${first} `),
      ...args.map(syntaxHighlight),
    ])
  },
  group: function (first, ...args: any[]): void {
    serverLogs.log(`┍━${first}`, ...args)
    globalIndent.indentUp()
  },
  groupCollapsed: function (first, ...args: any[]): void {
    serverLogs.log(`┍━${first}`, ...args)
    globalIndent.indentUp()
  },
  groupEnd: function (first = "────────────", ...args: any[]): void {
    globalIndent.indentDown()
    serverLogs.log(`┕━${first}`, ...args)
  },
}
