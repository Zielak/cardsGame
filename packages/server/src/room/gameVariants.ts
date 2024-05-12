type VariantPreset<T> = {
  name: string
  data: DeepPartial<T>
  /** Should this preset be merging with the defaults or not? */
  includesDefaults?: boolean
}

export type VariantsConfig<T> = {
  defaults: Required<T>
  /**
   * Decide how you want to send variant data from the client
   * and parse it into final format here.
   */
  parse?: (value: unknown) => T
  /**
   * Validate variant data.
   * For example you can use `joi` library to validate schema.
   *
   * @param data after parsing
   * @returns `true` if data is valid. Any other value = error. If returning string, it will be sent back to the client.
   */
  validate?: (data: T) => boolean | string
  presets?: VariantPreset<T>[]
}
