import { noop } from "@cardsgame/utils"

export enum LogLevels {
  silent,
  error,
  warn,
  info,
  notice,
  verbose
}

let logLevel = LogLevels.silent

export const logs: {
  error: (...args: any[]) => void
  warn: (...args: any[]) => void
  info: (...args: any[]) => void
  notice: (...args: any[]) => void
  verbose: (...args: any[]) => void
} = {
  error: console.error.bind(window.console),
  warn: console.warn.bind(window.console),
  info: console.info.bind(window.console),
  notice: console.log.bind(window.console),
  verbose: console.debug.bind(window.console)
  // verbose: function () {
  // 	const _arguments = Array.from(arguments)
  // 	const args = [
  // 		'%c' + _arguments.shift(),
  // 		'color: grey; margin-left: 20px',
  // 		..._arguments
  // 	]
  // 	return console.log.apply(window.console, args)
  // }.bind(window.console)
}

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
}

try {
  if (localStorage && localStorage.getItem("cardsDebug")) {
    setLogLevel(localStorage.getItem("cardsDebug"))
  }
} catch (e) {
  // disabled
}

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
