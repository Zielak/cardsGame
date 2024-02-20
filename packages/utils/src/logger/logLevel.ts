import { LogLevels } from "./types.js"

const logLevelsMap: Array<LogLevels | LogLevels[]> = [
  "error",
  "warn",
  "info",
  ["notice", "log"],
  ["verbose", "debug"],
]

let logLevel: LogLevels = "silent"
let allowedLogs: LogLevels[] = []

function isLogLevel(v: unknown): v is LogLevels {
  switch (v) {
    case "silent":
    case "error":
    case "warn":
    case "info":
    case "notice":
    case "log":
    case "verbose":
    case "debug":
      return true
    default:
      return false
  }
}

function getAllowedLogs(expected: LogLevels) {
  let ok = false
  return logLevelsMap.reduceRight<LogLevels[]>((allowed, entry) => {
    const levels = Array.isArray(entry) ? entry : [entry]

    if (ok) {
      allowed.push(...levels)
      return allowed
    }
    if (levels.includes(expected)) {
      ok = true
    }

    return allowed
  }, [])
}

export const getLogLevel = (): LogLevels => logLevel

export const setLogLevel = (val: string): void => {
  if (val == "true") {
    logLevel = "log"
  } else if (isLogLevel(val)) {
    logLevel = val
  } else {
    console.log("setLogLevel, invalid value", logLevel)
    return
  }
  allowedLogs = getAllowedLogs(logLevel)
  console.log("setLogLevel", logLevel)
}

export const levelAllowed = (expected: LogLevels): boolean =>
  allowedLogs.includes(expected)
