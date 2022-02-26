import type {
  Schema,
  CollectionCallback,
  ObjectsCollectionSchema,
} from "./types"

export class ChildrenDecorator<V extends Schema = any> {
  private childrenCollectionsNames: string[] = []

  protected $items: Map<string, V> = new Map<string, V>()
  protected $indexes: Map<number, string> = new Map<number, string>()

  constructor(private schema: V) {
    Object.keys(schema._definition.schema)
      .filter((prop) => prop.startsWith("children"))
      .map((prop) => [schema[prop], prop])
      .forEach(([collection, prop]: [ObjectsCollectionSchema, string]) => {
        this.childrenCollectionsNames.push(prop)

        collection.onAdd = (item, key) => {
          const newKey = `${prop}_${key}`
          this.$items.set(newKey, item)
          // Callback
          this.onAdd?.(item, newKey)
        }
        collection.onRemove = (item, key) => {
          const newKey = `${prop}_${key}`
          this.$items.delete(newKey)
          // Callback
          this.onRemove?.(item, newKey)
        }
        ;[...collection.entries()].forEach(([index, item]) => {
          collection.onAdd(item, index)
        })
      })
  }

  onAdd: CollectionCallback<V>
  onRemove: CollectionCallback<V>

  get(key: string): V {
    return this.$items.get(key)
  }
  has(key: string): boolean {
    return this.$items.has(key)
  }

  forEach(
    callbackfn: (value: V, key: string, map: Map<string, V>) => void
  ): void {
    this.$items.forEach(callbackfn)
  }

  entries(): IterableIterator<[string, V]> {
    return this.$items.entries()
  }

  keys(): IterableIterator<string> {
    return this.$items.keys()
  }

  values(): IterableIterator<V> {
    return this.$items.values()
  }

  get size(): number {
    return this.$items.size
  }

  // -----

  /**
   * Every of `Array`
   */
  every(
    callbackfn: (value: V, index: number, array: V[]) => unknown,
    thisArg?: any
  ): boolean {
    return Array.from(this.$items.values()).every(callbackfn, thisArg)
  }

  /**
   * Some of `Array`
   */
  some(
    callbackfn: (value: V, index: number, array: V[]) => unknown,
    thisArg?: any
  ): boolean {
    return Array.from(this.$items.values()).some(callbackfn, thisArg)
  }

  /**
   * Map of `Array`
   */
  map<U>(
    callbackfn: (value: V, index: number, array: V[]) => U,
    thisArg?: any
  ): U[] {
    return Array.from(this.$items.values()).map(callbackfn, thisArg)
  }

  /**
   * Find of `Array`
   */
  find(
    predicate: (value: V, index: number, obj: V[]) => boolean,
    thisArg?: any
  ): V | undefined {
    return Array.from(this.$items.values()).find(predicate, thisArg)
  }

  /**
   * Filter of `Array`
   */
  filter(
    callbackfn: (value: V, index: number, array: V[]) => unknown,
    thisArg?: any
  )
  filter<S extends V>(
    callbackfn: (value: V, index: number, array: V[]) => value is S,
    thisArg?: any
  ): V[] {
    return Array.from(this.$items.values()).filter(callbackfn, thisArg)
  }

  /**
   * Reduce of `Array`
   */
  reduce<U = V>(
    callbackfn: (prev: U, current: V, index: number, array: V[]) => U,
    initialValue?: U
  ): U {
    return Array.from(this.$items.values()).reduce(callbackfn, initialValue)
  }

  /**
   * ReduceRight of `Array`
   */
  reduceRight<U = V>(
    callbackfn: (prev: U, current: V, index: number, array: V[]) => U,
    initialValue?: U
  ): U {
    return Array.from(this.$items.values()).reduceRight(
      callbackfn,
      initialValue
    )
  }

  /**
   * All children in one array. Unsorted.
   */
  toArray(): V[] {
    return this.childrenCollectionsNames
      .map((name) => this.schema[name])
      .reduce((all, collection) => {
        all.push(...collection.$items.values())
        return all
      }, [])
  }
}

/**
 * Creates new schema-like object containing all child entities in a Map.
 * You can subscribe to `onAdd` and `onRemove` the same way as with
 * any other collections.
 *
 * @param schema schema object of all child entities in given container entity
 */
export function makeChildrenCollection(schema: Schema): ChildrenDecorator {
  return new ChildrenDecorator(schema)
}
