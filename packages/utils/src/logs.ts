import chalk from "chalk"
import { noop } from "./utils"

const isBrowser = new Function(
  "try {return this===window;}catch(e){ return false;}"
)()

export enum LogLevels {
  silent,
  error,
  warn,
  info,
  notice,
  verbose
}

let logLevel = LogLevels.silent

export const setLogLevel = (val: string) => {
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
}

const syntaxHighlight = (arg: any) => {
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

// Testing logs
// log('--- Testing logs, ignore me ---')

// log('Simple log', 'one', 2, true)
// info('Info', 'one', 2, true)
// warn('Warn', 'one', 2, true)
// error('Error', 'one', 2, true)

// log('--- Testing logs finished ---')

export const logs: {
  error: (...args: any[]) => void
  warn: (...args: any[]) => void
  info: (...args: any[]) => void
  notice: (...args: any[]) => void
  verbose: (...args: any[]) => void
} = isBrowser
  ? {
      verbose: console.debug.bind(window.console),
      notice: console.log.bind(window.console),
      info: console.info.bind(window.console),
      warn: console.warn.bind(window.console),
      error: console.error.bind(window.console)
    }
  : {
      verbose: function(...args: any[]) {
        console.log.apply(console, [`\t`, ...args.map(arg => chalk.gray(arg))])
      },
      notice: function(first, ...args: any[]) {
        if (args.length > 0) {
          console.log.apply(console, [
            `${first}:`,
            ...args.map(syntaxHighlight)
          ])
        } else {
          console.log.call(console, chalk.gray(`\t${first}`))
        }
      },
      info: function(first, ...args: any[]) {
        console.info.apply(console, [
          chalk.bgBlue.black(` ${first} `),
          ...args.map(syntaxHighlight)
        ])
      },
      warn: function(first, ...args: any[]) {
        console.warn.apply(console, [
          chalk.bgYellow.black(` ${first} `),
          ...args.map(syntaxHighlight)
        ])
      },
      error: function(first, ...args: any[]) {
        console.error.apply(console, [
          chalk.bgRed(` ${first} `),
          ...args.map(syntaxHighlight)
        ])
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
