import { chalk, decimal } from "@cardsgame/utils"

export const markDebugTime = (last: number): string => {
  const delta = decimal(performance.now() - last, 1)
  let color
  if (delta >= 100) {
    color = chalk.white.bgRed
  } else if (delta >= 50) {
    color = chalk.white.bgYellow
  } else {
    color = chalk.bgGreen
  }
  return color(`(${delta}ms)`)
}
