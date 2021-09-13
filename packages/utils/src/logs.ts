import Chalk from "chalk"

import { noop } from "./functions"
import { isBrowser, minifyEntity } from "./logger/utils"

export const chalk = new Chalk.Instance({
  level: isBrowser ? 0 : 1,
})

const BROWSER_DEBUG_STYLE = "margin-left:2em;"

export enum LogLevels {
  silent,
  error,
  warn,
  info,
  notice,
  verbose,
}

let logLevel = LogLevels.silent

const setLogLevel = (val: string): void => {
  switch (val) {
    case "silent":
      logLevel = LogLevels.silent
      break
    case "error":
      logLevel = LogLevels.error
      break
    case "warn":
      logLevel = LogLevels.warn
      break
    case "info":
      logLevel = LogLevels.info
      break
    case "notice":
      logLevel = LogLevels.notice
      break
    case "verbose":
      logLevel = LogLevels.verbose
      break
    case "true":
      logLevel = LogLevels.notice
      break
    default:
      logLevel = LogLevels.silent
  }
  console.log("setLogLevel", logLevel)
}

const syntaxHighlight = (arg: any): any => {
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

let _indentLevel = 0

function _getIndent(): string {
  return Array(_indentLevel).fill("│ ").join("")
}

let logsPreExport: {
  error: (...args: any[]) => void
  warn: (...args: any[]) => void
  info: (...args: any[]) => void
  /**
   * @deprecated use `log()` instead
   */
  notice: (...args: any[]) => void
  log: (...args: any[]) => void
  /**
   * @deprecated use `debug()` instead
   */
  verbose: (...args: any[]) => void
  debug: (...args: any[]) => void
  group: (...args: any[]) => void
  groupCollapsed: (...args: any[]) => void
  groupEnd: (...args: any[]) => void
}

if (isBrowser) {
  logsPreExport = {
    verbose: console.debug.bind(window.console),
    debug: console.debug.bind(window.console),
    notice: console.log.bind(window.console),
    log: console.log.bind(window.console),
    info: console.info.bind(window.console),
    warn: console.warn.bind(window.console),
    error: console.error.bind(window.console),
    group: console.group.bind(window.console),
    groupCollapsed: console.groupCollapsed.bind(window.console),
    groupEnd: console.groupEnd.bind(window.console),
  }
} else {
  logsPreExport = {
    verbose: function (...args: any[]): void {
      console.debug.apply(console, [
        _getIndent(),
        `\t`,
        ...args.map((arg) => chalk.gray(arg)),
      ])
    },
    debug: function (...args: any[]): void {
      console.debug.apply(console, [
        _getIndent(),
        `\t`,
        ...args.map((arg) => chalk.gray(arg)),
      ])
    },
    notice: function (first, ...args: any[]): void {
      if (args.length > 0) {
        console.log.apply(console, [
          _getIndent(),
          `${first}:`,
          ...args.map(syntaxHighlight),
        ])
      } else {
        console.log.call(console, chalk.gray(_getIndent() + first))
      }
    },
    log: function (first, ...args: any[]): void {
      if (args.length > 0) {
        console.log.apply(console, [
          _getIndent(),
          `${first}:`,
          ...args.map(syntaxHighlight),
        ])
      } else {
        console.log.call(console, chalk.gray(_getIndent() + first))
      }
    },
    info: function (first, ...args: any[]): void {
      console.info.apply(console, [
        _getIndent() + chalk.bgBlue.black(` ${first} `),
        ...args.map(syntaxHighlight),
      ])
    },
    warn: function (first, ...args: any[]): void {
      console.warn.apply(console, [
        _getIndent() + chalk.bgYellow.black(` ${first} `),
        ...args.map(syntaxHighlight),
      ])
    },
    error: function (first, ...args: any[]): void {
      console.error.apply(console, [
        _getIndent() + chalk.bgRed(` ${first} `),
        ...args.map(syntaxHighlight),
      ])
    },
    group: function (first, ...args: any[]): void {
      logsPreExport.log(`┍━${first}`, ...args)
      _indentLevel++
    },
    groupCollapsed: function (first, ...args: any[]): void {
      logsPreExport.log(`┍━${first}`, ...args)
      _indentLevel++
    },
    groupEnd: function (first = "────────────", ...args: any[]): void {
      _indentLevel = Math.max(_indentLevel - 1, 0)
      logsPreExport.log(`┕━${first}`, ...args)
    },
  }
}

try {
  if (isBrowser && localStorage && localStorage.getItem("cardsDebug")) {
    setLogLevel(localStorage.getItem("cardsDebug"))
  } else if (!isBrowser) {
    setLogLevel(process.env.LOGS)
  }
} catch (e) {
  // disabled
}

// Override log functions in case of lower desired audacity
if (logLevel < LogLevels.error) {
  logsPreExport.error = noop
}
if (logLevel < LogLevels.warn) {
  logsPreExport.warn = noop
}
if (logLevel < LogLevels.info) {
  logsPreExport.info = noop
}
if (logLevel < LogLevels.notice) {
  logsPreExport.notice = noop
  logsPreExport.log = noop
}
if (logLevel < LogLevels.verbose) {
  logsPreExport.verbose = noop
  logsPreExport.debug = noop
}

export const logs = logsPreExport

export interface Logs {
  error: (...any) => void
  warn: (...any) => void
  info: (...any) => void
  /**
   * @deprecated use `log()` instead
   */
  notice: (...any) => void
  log: (...any) => void
  /**
   * @deprecated use `debug()` instead
   */
  verbose: (...any) => void
  debug: (...any) => void
  group: (...any) => void
  groupCollapsed: (...any) => void
  groupEnd: (...any) => void
}
/**
 * Local logging utility
 */
type LogsOptions = {
  browserStyle?: string
  serverStyle?: Chalk.Chalk
}
export class Logs {
  constructor(
    name: string,
    private readonly enabled = false,
    options?: LogsOptions
  ) {
    if (isBrowser) {
      this.setupBrowserLogs(name, options.browserStyle)
    } else {
      this.setupServerLogs(name, options.serverStyle)
    }
  }

  setupServerLogs(name: string, style: Chalk.Chalk): void {
    let indentLevel = 0
    const getIndent = (): string => {
      return Array(indentLevel).fill("│ ").join("")
    }

    this["error"] =
      this.enabled && logLevel >= LogLevels.error
        ? function (first, ...args: any[]): void {
            console.error.apply(console, [
              style(getIndent() + chalk.bgRed(` ${first} `)),
              ...args.map(syntaxHighlight),
            ])
          }
        : noop
    this["warn"] =
      this.enabled && logLevel >= LogLevels.warn
        ? function (first, ...args: any[]): void {
            console.warn.apply(console, [
              style(getIndent() + chalk.bgYellow.black(` ${first} `)),
              ...args.map(syntaxHighlight),
            ])
          }
        : noop
    this["info"] =
      this.enabled && logLevel >= LogLevels.info
        ? function (first, ...args: any[]): void {
            console.info.apply(console, [
              style(getIndent() + chalk.bgBlue.black(` ${first} `)),
              ...args.map(syntaxHighlight),
            ])
          }
        : noop
    this["log"] = this["notice"] =
      this.enabled && logLevel >= LogLevels.notice
        ? function (first, ...args: any[]): void {
            if (args.length > 0) {
              console.log.apply(console, [
                style(getIndent(), `${first}:`),
                ...args.map(syntaxHighlight),
              ])
            } else {
              console.log.call(console, style(chalk.gray(getIndent() + first)))
            }
          }
        : noop
    const _log = this["log"]
    this["debug"] = this["verbose"] =
      this.enabled && logLevel >= LogLevels.verbose
        ? function (...args: any[]): void {
            console.debug.apply(console, [
              style(`${getIndent()}\t`),
              ...args.map((arg) => chalk.gray(arg)),
            ])
          }
        : noop
    this["group"] = this.enabled
      ? function (first, ...args: any[]): void {
          _log(`┍━${first}`, ...args)
          indentLevel++
        }
      : noop
    this["groupCollapsed"] = this.enabled
      ? function (first, ...args: any[]): void {
          _log(`┍━${first}`, ...args)
          indentLevel++
        }
      : noop
    this["groupEnd"] = this.enabled
      ? function (first = "────────────", ...args: any[]): void {
          indentLevel = Math.max(indentLevel - 1, 0)
          _log(`┕━${first}`, ...args)
        }
      : noop
  }

  setupBrowserLogs(name: string, style: string): void {
    this["error"] =
      this.enabled && logLevel >= LogLevels.error
        ? (function (): any {
            return Function.prototype.bind.call(
              console.error,
              console,
              `%c ${name} `,
              style
            )
          })()
        : noop
    this["warn"] =
      this.enabled && logLevel >= LogLevels.warn
        ? (function (): any {
            return Function.prototype.bind.call(
              console.warn,
              console,
              `%c ${name} `,
              style
            )
          })()
        : noop
    this["info"] =
      this.enabled && logLevel >= LogLevels.info
        ? (function (): any {
            return Function.prototype.bind.call(
              console.info,
              console,
              `%c ${name} `,
              style
            )
          })()
        : noop
    this["log"] = this["notice"] =
      this.enabled && logLevel >= LogLevels.notice
        ? (function (): any {
            return Function.prototype.bind.call(
              console.log,
              console,
              `%c ${name} `,
              style
            )
          })()
        : noop
    this["debug"] = this["verbose"] =
      this.enabled && logLevel >= LogLevels.verbose
        ? (function (): any {
            return Function.prototype.bind.call(
              console.debug,
              console,
              `%c ${name} `,
              style + BROWSER_DEBUG_STYLE
            )
          })()
        : noop
    this["group"] = this.enabled
      ? console.group.bind(console, `%c ${name} `, style)
      : noop
    this["groupCollapsed"] = this.enabled
      ? console.groupCollapsed.bind(console, `%c ${name} `, style)
      : noop
    this["groupEnd"] = this.enabled
      ? (function (): any {
          return Function.prototype.bind.call(console.groupEnd, console)
        })()
      : noop
  }
}
