import { noop } from "../functions.js"

import { Logger } from "./baseLogger.js"

const DEBUG_STYLE = "margin-left:2em;"

export class BrowserLogger extends Logger {
  constructor(name = "", enabled = true, style?: string) {
    super(name, enabled)

    if (window.localStorage.getItem("cardsDebug")) {
      this.logLevel = localStorage.getItem("cardsDebug")
    }

    this["error"] =
      this.enabled && this.levelAllowed("error")
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
      this.enabled && this.levelAllowed("warn")
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
      this.enabled && this.levelAllowed("info")
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
      this.enabled && this.levelAllowed("notice")
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
      this.enabled && this.levelAllowed("verbose")
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
