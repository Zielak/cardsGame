import { LogLevels } from "./types.js"

const logLevelsMap: Array<LogLevels | LogLevels[]> = [
  "error",
  "warn",
  "info",
  ["notice", "log"],
  ["verbose", "debug"],
]

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

function getAllowedLogs(expected: LogLevels): LogLevels[] {
  let ok = false
  return logLevelsMap.reduceRight<LogLevels[]>((allowed, entry) => {
    const levels = Array.isArray(entry) ? entry : [entry]

    if (levels.includes(expected)) {
      ok = true
    }

    if (ok) {
      allowed.push(...levels)
    }

    return allowed
  }, [])
}

export abstract class Logger {
  protected indentLevel = 0
  protected _logLevel: LogLevels = "silent"
  protected allowedLogs: LogLevels[] = []

  constructor(
    protected readonly name: string,
    protected readonly enabled: boolean,
  ) {}

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

  protected getIndent(): string {
    return Array(this.indentLevel).fill("│ ").join("")
  }

  protected indentUp(): void {
    this.indentLevel++
  }

  protected indentDown(): void {
    this.indentLevel = Math.max(this.indentLevel - 1, 0)
  }

  protected nameAndFirst(first: string): string {
    return `${this.name} ${first}`
  }

  get logLevel(): LogLevels {
    return this._logLevel
  }
  set logLevel(val: string) {
    if (val == "true") {
      this._logLevel = "log"
    } else if (isLogLevel(val)) {
      this._logLevel = val
    } else {
      console.log("setLogLevel, invalid value", this._logLevel)
      return
    }
    this.allowedLogs = getAllowedLogs(this._logLevel)
    this.log?.("setLogLevel", this._logLevel)
  }
  protected levelAllowed(expected: LogLevels): boolean {
    return this.allowedLogs.includes(expected)
  }
}
