import { noop } from "../../functions.js"
import { Logger } from "../baseLogger.js"
import { levelAllowed } from "../logLevel.js"
import { LogsExport } from "../types.js"

const DEBUG_STYLE = "margin-left:2em;"

export class BrowserLogger extends Logger implements LogsExport {
  nameAndFirst(first: string): string {
    return `${this.name} ${first}`
  }

  error: (...args: any[]) => void
  warn: (...args: any[]) => void
  info: (...args: any[]) => void
  notice: (...args: any[]) => void
  log: (...args: any[]) => void
  verbose: (...args: any[]) => void
  debug: (...args: any[]) => void
  group: (...args: any[]) => void
  groupCollapsed: (...args: any[]) => void
  groupEnd: (...args: any[]) => void

  constructor(
    private readonly name: string,
    private readonly enabled = false,
    style?: string,
  ) {
    super()

    this["error"] =
      this.enabled && levelAllowed("error")
        ? (function (): any {
            return Function.prototype.bind.call(
              console.error,
              console,
              `%c ${name} `,
              style,
            )
          })()
        : noop
    this["warn"] =
      this.enabled && levelAllowed("warn")
        ? (function (): any {
            return Function.prototype.bind.call(
              console.warn,
              console,
              `%c ${name} `,
              style,
            )
          })()
        : noop
    this["info"] =
      this.enabled && levelAllowed("info")
        ? (function (): any {
            return Function.prototype.bind.call(
              console.info,
              console,
              `%c ${name} `,
              style,
            )
          })()
        : noop
    this["log"] = this["notice"] =
      this.enabled && levelAllowed("notice")
        ? (function (): any {
            return Function.prototype.bind.call(
              console.log,
              console,
              `%c ${name} `,
              style,
            )
          })()
        : noop
    this["debug"] = this["verbose"] =
      this.enabled && levelAllowed("verbose")
        ? (function (): any {
            return Function.prototype.bind.call(
              console.debug,
              console,
              `%c ${name} `,
              style + DEBUG_STYLE,
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
