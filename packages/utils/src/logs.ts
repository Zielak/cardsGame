import { noop } from "./functions.js"
import { getGlobalLogger } from "./logger/globalLogger.js"
import { getLogLevel } from "./logger/logLevel.js"

const logsPreExport = getGlobalLogger()

// Override log functions in case of lower desired audacity
switch (getLogLevel()) {
  case "error":
    logsPreExport.warn = noop
  case "warn":
    logsPreExport.info = noop
  case "info":
    logsPreExport.log = noop
    logsPreExport.notice = noop
  case "notice":
  case "log":
    logsPreExport.debug = noop
    logsPreExport.verbose = noop
}

export const logs = logsPreExport
