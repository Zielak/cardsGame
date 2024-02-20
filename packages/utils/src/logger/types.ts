/**
 * @ignore
 */
export type LogLevels =
  | "silent"
  | "error"
  | "warn"
  | "info"
  /**
   * @deprecated use `log` instead
   */
  | "notice"
  | "log"
  /**
   * @deprecated use `debug` instead
   */
  | "verbose"
  | "debug"

export interface LogsExport {
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
}
