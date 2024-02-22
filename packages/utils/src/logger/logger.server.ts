import Chalk from "chalk"

import { noop } from "../functions.js"

import { Logger } from "./baseLogger.js"
import { chalk, syntaxHighlight } from "./utils.server.js"

export class ServerLogger extends Logger {
  nameAndFirst(first: string): string {
    return `${this.name} ${first}`
  }

  constructor(name = "", enabled = true, style: Chalk.Chalk = undefined) {
    super(name, enabled)

    const { LOGS } = process.env

    this.logLevel = LOGS === "true" ? "log" : "" + LOGS

    const indentUp = this.indentUp.bind(this)
    const indentDown = this.indentDown.bind(this)
    const getIndent = this.getIndent.bind(this)

    function error(first, ...args: any[]): void {
      const value =
        getIndent() +
        chalk.bgRed.white(` ${name ? this.nameAndFirst(first) : first} `)

      console.error.apply(console, [
        style ? style(value) : value,
        ...args.map(syntaxHighlight),
      ])
    }
    function warn(first, ...args: any[]): void {
      const value =
        getIndent() +
        chalk.bgYellow.black(` ${name ? this.nameAndFirst(first) : first} `)

      console.warn.apply(console, [
        style ? style(value) : value,
        ...args.map(syntaxHighlight),
      ])
    }
    function info(first, ...args: any[]): void {
      const value =
        getIndent() +
        chalk.bgBlue.black(` ${name ? this.nameAndFirst(first) : first} `)

      console.info.apply(console, [
        style ? style(value) : value,
        ...args.map(syntaxHighlight),
      ])
    }
    function log(first, ...args: any[]): void {
      if (args.length > 0) {
        const value = `${getIndent()} ${first}:`
        console.log.apply(console, [
          style ? style(value) : value,
          ...args.map(syntaxHighlight),
        ])
      } else {
        const value = chalk.gray(getIndent() + first)
        console.log.call(console, style ? style(value) : value)
      }
    }
    function debug(...args: any[]): void {
      const value = `${getIndent()}\t`

      console.debug.apply(console, [
        style ? style(value) : value,
        ...args.map((arg) => chalk.gray(arg)),
      ])
    }

    this["error"] = this.enabled && this.levelAllowed("error") ? error : noop
    this["warn"] = this.enabled && this.levelAllowed("warn") ? warn : noop
    this["info"] = this.enabled && this.levelAllowed("info") ? info : noop
    this["log"] = this.enabled && this.levelAllowed("notice") ? log : noop
    const _log = this["log"]
    this["notice"] = this["log"]

    this["debug"] = this.enabled && this.levelAllowed("verbose") ? debug : noop
    this["verbose"] = this["debug"]

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
