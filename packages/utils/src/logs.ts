import Chalk from "chalk"

import { noop } from "./utils"

const isBrowser = new Function(
  "try {return this===window;}catch(e){ return false;}"
)()

export const IS_CHROME = process ? Boolean(process.env.LOGS_CHROME) : false

export const chalk = new Chalk.Instance({
  level: isBrowser ? 0 : IS_CHROME ? 0 : 1,
})

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

const minifyEntity = ({ type, name }): string => `${type}:${name}`

const syntaxHighlight = (arg: any): any => {
  if (IS_CHROME) {
    return arg
  }
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

export let logs: {
  error: (...args: any[]) => void
  warn: (...args: any[]) => void
  info: (...args: any[]) => void
  notice: (...args: any[]) => void
  verbose: (...args: any[]) => void
  group: (...args: any[]) => void
  groupCollapsed: (...args: any[]) => void
  groupEnd: (...args: any[]) => void
}

if (isBrowser) {
  logs = {
    verbose: console.debug.bind(window.console),
    notice: console.log.bind(window.console),
    info: console.info.bind(window.console),
    warn: console.warn.bind(window.console),
    error: console.error.bind(window.console),
    group: console.group.bind(window.console),
    groupCollapsed: console.groupCollapsed.bind(window.console),
    groupEnd: console.groupEnd.bind(window.console),
  }
} else if (!IS_CHROME) {
  logs = {
    verbose: function (...args: any[]): void {
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
      logs.notice(`┍━${first}`, ...args)
      _indentLevel++
    },
    groupCollapsed: function (first, ...args: any[]): void {
      logs.notice(`┍━${first}`, ...args)
      _indentLevel++
    },
    groupEnd: function (first = "────────────", ...args: any[]): void {
      _indentLevel = Math.max(_indentLevel - 1, 0)
      logs.notice(`┕━${first}`, ...args)
    },
  }
} else {
  const styles = {
    common: "padding: 1px 5px; margin: -1px 0;",
    info: "color: white; background: #2196f3",
  }

  logs = {
    verbose: console.debug.bind(console),
    notice: console.log.bind(console),
    info: function (first, ...args: any[]): void {
      return console.info.apply(console, [
        `%c ${first} `,
        styles.common + styles.info,
        ...args.map(syntaxHighlight),
      ])
    },
    warn: console.warn.bind(console),
    error: console.error.bind(console),
    group: (...args): void => {
      // Silence one-off console.log
      const tmp = console.log
      global.console.log = noop
      global.console.group.apply(console, args)
      global.console.log = tmp
    },
    groupCollapsed: (...args): void => {
      // Silence one-off console.log
      const tmp = console.log
      global.console.log = noop
      global.console.groupCollapsed.apply(console, args)
      global.console.log = tmp
    },
    groupEnd: console.groupEnd.bind(console),
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
  logs.error = noop
}
if (logLevel < LogLevels.warn) {
  logs.warn = noop
}
if (logLevel < LogLevels.info) {
  logs.info = noop
}
if (logLevel < LogLevels.notice) {
  logs.notice = noop
}
if (logLevel < LogLevels.verbose) {
  logs.verbose = noop
}

export interface Logs {
  error: (...any) => void
  warn: (...any) => void
  info: (...any) => void
  notice: (...any) => void
  verbose: (...any) => void
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
      logLevel < LogLevels.error && this.enabled
        ? noop
        : function (first, ...args: any[]): void {
            console.error.apply(console, [
              style(getIndent() + chalk.bgRed(` ${first} `)),
              ...args.map(syntaxHighlight),
            ])
          }
    this["warn"] =
      logLevel < LogLevels.warn && this.enabled
        ? noop
        : function (first, ...args: any[]): void {
            console.warn.apply(console, [
              style(getIndent() + chalk.bgYellow.black(` ${first} `)),
              ...args.map(syntaxHighlight),
            ])
          }
    this["info"] =
      logLevel < LogLevels.info && this.enabled
        ? noop
        : function (first, ...args: any[]): void {
            console.info.apply(console, [
              style(getIndent() + chalk.bgBlue.black(` ${first} `)),
              ...args.map(syntaxHighlight),
            ])
          }
    this["notice"] =
      logLevel < LogLevels.notice && this.enabled
        ? noop
        : function (first, ...args: any[]): void {
            if (args.length > 0) {
              console.log.apply(console, [
                style(getIndent(), `${first}:`),
                ...args.map(syntaxHighlight),
              ])
            } else {
              console.log.call(console, style(chalk.gray(getIndent() + first)))
            }
          }
    const notice = this["notice"]
    this["verbose"] =
      logLevel < LogLevels.verbose && this.enabled
        ? noop
        : function (...args: any[]): void {
            console.debug.apply(console, [
              style(`${getIndent()}\t`),
              ...args.map((arg) => chalk.gray(arg)),
            ])
          }
    this["group"] = !this.enabled
      ? noop
      : function (first, ...args: any[]): void {
          notice(`┍━${first}`, ...args)
          indentLevel++
        }
    this["groupCollapsed"] = !this.enabled
      ? noop
      : function (first, ...args: any[]): void {
          notice(`┍━${first}`, ...args)
          indentLevel++
        }
    this["groupEnd"] = !this.enabled
      ? noop
      : function (first = "────────────", ...args: any[]): void {
          indentLevel = Math.max(indentLevel - 1, 0)
          notice(`┕━${first}`, ...args)
        }
  }

  setupBrowserLogs(name: string, style: string): void {
    this["error"] =
      logLevel < LogLevels.error && this.enabled
        ? noop
        : (function (): any {
            return Function.prototype.bind.call(
              console.error,
              console,
              `%c ${name} `,
              style
            )
          })()
    this["warn"] =
      logLevel < LogLevels.warn && this.enabled
        ? noop
        : (function (): any {
            return Function.prototype.bind.call(
              console.warn,
              console,
              `%c ${name} `,
              style
            )
          })()
    this["info"] =
      logLevel < LogLevels.info && this.enabled
        ? noop
        : (function (): any {
            return Function.prototype.bind.call(
              console.info,
              console,
              `%c ${name} `,
              style
            )
          })()
    this["notice"] =
      logLevel < LogLevels.notice && this.enabled
        ? noop
        : (function (): any {
            return Function.prototype.bind.call(
              console.log,
              console,
              `%c ${name} `,
              style
            )
          })()
    this["verbose"] =
      logLevel < LogLevels.verbose && this.enabled
        ? noop
        : (function (): any {
            return Function.prototype.bind.call(
              console.debug,
              console,
              `%c ${name} `,
              style
            )
          })()
    this["group"] = !this.enabled
      ? noop
      : console.group.bind(console, `%c ${name} `, style)
    this["groupCollapsed"] = !this.enabled
      ? noop
      : console.groupCollapsed.bind(console, `%c ${name} `, style)
    this["groupEnd"] = !this.enabled
      ? noop
      : (function (): any {
          return Function.prototype.bind.call(console.groupEnd, console)
        })()
  }
}
