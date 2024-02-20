import { setLogLevel } from "../logLevel.js"
import { LogsExport } from "../types.js"

if (window?.localStorage?.getItem("cardsDebug")) {
  setLogLevel(localStorage.getItem("cardsDebug"))
}

export const browserLogs: LogsExport = {
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
