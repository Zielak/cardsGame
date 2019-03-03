import chalk from "chalk"
import { Entity } from "./entity"

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
  if (arg instanceof Entity) {
    return chalk.yellow(minifyEntity(arg))
  }
  return arg
}

const verbose = function(...args: any[]) {
  console.log.apply(console, [`\t`, ...args.map(arg => chalk.gray(arg))])
}
const log = function(first, ...args: any[]) {
  if (args.length > 0) {
    console.log.apply(console, [`${first}:`, ...args.map(syntaxHighlight)])
  } else {
    console.log.call(console, chalk.gray(`\t${first}`))
  }
}
const info = function(first, ...args: any[]) {
  console.info.apply(console, [
    chalk.bgBlue.black(` ${first} `),
    ...args.map(syntaxHighlight)
  ])
}
const warn = function(first, ...args: any[]) {
  console.warn.apply(console, [
    chalk.bgYellow.black(` ${first} `),
    ...args.map(syntaxHighlight)
  ])
}
const error = function(first, ...args: any[]) {
  console.error.apply(console, [
    chalk.bgRed(` ${first} `),
    ...args.map(syntaxHighlight)
  ])
}

export const logs = {
  verbose,
  log,
  info,
  warn,
  error
}

export const minifyEntity = (e: Entity): string => {
  return `${e.type}:${e.name}`
}

// Testing logs
// log('--- Testing logs, ignore me ---')

// log('Simple log', 'one', 2, true)
// info('Info', 'one', 2, true)
// warn('Warn', 'one', 2, true)
// error('Error', 'one', 2, true)

// log('--- Testing logs finished ---')
