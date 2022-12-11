// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ActionRegistry {}

type ActionContext<T> = {
  [k in keyof ActionRegistry]: ActionRegistry[k] extends [T, infer P]
    ? P
    : never
}[keyof ActionRegistry]
