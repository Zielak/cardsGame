import Chalk from "chalk"

import { noop } from "../../functions.js"
import { Logger } from "../baseLogger.js"
import { levelAllowed } from "../logLevel.js"
import { LogsExport } from "../types.js"

import { chalk, syntaxHighlight } from "./utils.js"

export class ServerLogger extends Logger implements LogsExport {
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
    style: Chalk.Chalk = undefined,
  ) {
    super()

    const indentUp = this.indentUp
    const indentDown = this.indentDown
    const getIndent = this.getIndent

    this["error"] =
      this.enabled && levelAllowed("error")
        ? function (first, ...args: any[]): void {
            console.error.apply(console, [
              style(
                getIndent() +
                  chalk.bgRed.white(
                    ` ${name ? this.nameAndFirst(first) : first} `,
                  ),
              ),
              ...args.map(syntaxHighlight),
            ])
          }
        : noop
    this["warn"] =
      this.enabled && levelAllowed("warn")
        ? function (first, ...args: any[]): void {
            console.warn.apply(console, [
              style(
                getIndent() +
                  chalk.bgYellow.black(
                    ` ${name ? this.nameAndFirst(first) : first} `,
                  ),
              ),
              ...args.map(syntaxHighlight),
            ])
          }
        : noop
    this["info"] =
      this.enabled && levelAllowed("info")
        ? function (first, ...args: any[]): void {
            console.info.apply(console, [
              style(
                getIndent() +
                  chalk.bgBlue.black(
                    ` ${name ? this.nameAndFirst(first) : first} `,
                  ),
              ),
              ...args.map(syntaxHighlight),
            ])
          }
        : noop
    this["log"] = this["notice"] =
      this.enabled && levelAllowed("notice")
        ? function (first, ...args: any[]): void {
            if (args.length > 0) {
              console.log.apply(console, [
                style(getIndent(), `${first}:`),
                ...args.map(syntaxHighlight),
              ])
            } else {
              console.log.call(console, style(chalk.gray(getIndent() + first)))
            }
          }
        : noop
    const _log = this["log"]

    this["debug"] = this["verbose"] =
      this.enabled && levelAllowed("verbose")
        ? function (...args: any[]): void {
            console.debug.apply(console, [
              style(`${getIndent()}\t`),
              ...args.map((arg) => chalk.gray(arg)),
            ])
          }
        : noop
    this["group"] = this.enabled
      ? function (first, ...args: any[]): void {
          _log(`┍━${first}`, ...args)
          indentUp()
        }
      : noop
    this["groupCollapsed"] = this.enabled
      ? function (first, ...args: any[]): void {
          _log(`┍━${first}`, ...args)
          indentUp()
        }
      : noop
    this["groupEnd"] = this.enabled
      ? function (first = "────────────", ...args: any[]): void {
          indentDown()
          _log(`┕━${first}`, ...args)
        }
      : noop
  }
}
