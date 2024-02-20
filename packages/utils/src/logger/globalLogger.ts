/* eslint-disable @typescript-eslint/no-var-requires */
import { isBrowser } from "./isBrowser.js"

export function getGlobalLogger() {
  if (isBrowser()) {
    return require("./browser/global.js").browserLogs
  } else {
    return require("./server/global.js").serverLogs
  }
}
