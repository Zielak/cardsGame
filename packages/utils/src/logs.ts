import Chalk from "chalk"
import { noop } from "./utils"

const isBrowser = new Function(
  "try {return this===window;}catch(e){ return false;}"
)()

export const IS_CHROME = process ? Boolean(process.env.LOGS_CHROME) : false

export const chalk = new Chalk.constructor({ enabled: !IS_CHROME })

export enum LogLevels {
  silent,
  error,
  warn,
  info,
  notice,
  verbose
}

let logLevel = LogLevels.silent

const setLogLevel = (val: string) => {
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

const syntaxHighlight = (arg: any) => {
  if (IS_CHROME) return arg
  if (typeof arg === "string") {
    return chalk.gray(arg)
  }
  if (typeof arg === "number") {
    return chalk.red.bold("" + arg)
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

const minifyEntity = ({ type, name }): string => {
  return `${type}:${name}`
}

let indentLevel = 0

const getIndent = () => {
  return Array(indentLevel)
    .fill("│ ")
    .join("")
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
    groupEnd: console.groupEnd.bind(window.console)
  }
}
if (!IS_CHROME) {
  logs = {
    verbose: function(...args: any[]) {
      console.debug.apply(console, [
        getIndent(),
        `\t`,
        ...args.map(arg => chalk.gray(arg))
      ])
    },
    notice: function(first, ...args: any[]) {
      if (args.length > 0) {
        console.log.apply(console, [
          getIndent(),
          `${first}:`,
          ...args.map(syntaxHighlight)
        ])
      } else {
        console.log.call(console, chalk.gray(getIndent() + first))
      }
    },
    info: function(first, ...args: any[]) {
      console.info.apply(console, [
        getIndent() + chalk.bgBlue.black(` ${first} `),
        ...args.map(syntaxHighlight)
      ])
    },
    warn: function(first, ...args: any[]) {
      console.warn.apply(console, [
        getIndent() + chalk.bgYellow.black(` ${first} `),
        ...args.map(syntaxHighlight)
      ])
    },
    error: function(first, ...args: any[]) {
      console.error.apply(console, [
        getIndent() + chalk.bgRed(` ${first} `),
        ...args.map(syntaxHighlight)
      ])
    },
    group: function(first, ...args: any[]) {
      logs.notice(`┍━${first}`, ...args)
      indentLevel++
    },
    groupCollapsed: function(first, ...args: any[]) {
      logs.notice(`┍━${first}`, ...args)
      indentLevel++
    },
    groupEnd: function(first = "────────────", ...args: any[]) {
      indentLevel = Math.max(--indentLevel, 0)
      logs.notice(`┕━${first}`, ...args)
    }
  }
} else {
  const styles = {
    common: "padding: 1px 5px; margin: -1px 0;",
    info: "color: white; background: #2196f3"
  }

  logs = {
    verbose: console.debug.bind(console),
    notice: console.log.bind(console),
    info: function(first, ...args: any[]) {
      return console.info.apply(console, [
        `%c ${first} `,
        styles.common + styles.info,
        ...args.map(syntaxHighlight)
      ])
    },
    warn: console.warn.bind(console),
    error: console.error.bind(console),
    group: (...args) => {
      // Silence one-off console.log
      const tmp = console.log
      global.console.log = noop
      global.console.group.apply(console, args)
      global.console.log = tmp
    },
    groupCollapsed: (...args) => {
      // Silence one-off console.log
      const tmp = console.log
      global.console.log = noop
      global.console.groupCollapsed.apply(console, args)
      global.console.log = tmp
    },
    groupEnd: console.groupEnd.bind(console)
  }
}

try {
  if (isBrowser && localStorage && localStorage.getItem("cardsDebug")) {
    setLogLevel(localStorage.getItem("cardsDebug"))
  } else if (!isBrowser) {
    setLogLevel(process.env.IN_PASSENGER ? "verbose" : process.env.LOGS)
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
