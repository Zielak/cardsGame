import { map2Array, remove } from "../src/mapSchema"
import { MapSchema } from "@colyseus/schema"

describe("remove", () => {
  let map
  describe(`4 elements`, () => {
    beforeEach(() => {
      map = new MapSchema<string>()
      map[0] = "zero"
      map[1] = "one"
      map[2] = "two"
      map[3] = "three"
    })

    test(`remove first`, () => {
      expect(map[0]).toBe("zero")
      expect(map[1]).toBe("one")
      expect(map[2]).toBe("two")
      expect(map[3]).toBe("three")

      remove(map, 0)

      expect(Object.keys(map)).toEqual(["0", "1", "2"])
      expect(Object.keys(map).length).toBe(3)

      expect(map[0]).toBe("one")
      expect(map[1]).toBe("two")
      expect(map[2]).toBe("three")
    })

    test(`remove in the middle`, () => {
      remove(map, 2)

      expect(Object.keys(map)).toEqual(["0", "1", "2"])
      expect(Object.keys(map).length).toBe(3)

      expect(map[0]).toBe("zero")
      expect(map[1]).toBe("one")
      expect(map[2]).toBe("three")
    })

    test(`remove last`, () => {
      remove(map, 3)

      expect(Object.keys(map)).toEqual(["0", "1", "2"])
      expect(Object.keys(map).length).toBe(3)

      expect(map[0]).toBe("zero")
      expect(map[1]).toBe("one")
      expect(map[2]).toBe("two")
    })
  })
  describe("1 element", () => {
    beforeEach(() => {
      map = new MapSchema<string>()
      map[0] = "zero"
    })
    test(`remove the only one`, () => {
      remove(map, 0)

      expect(Object.keys(map)).toEqual([])
      expect(Object.keys(map).length).toBe(0)
      expect(map[0]).toBeUndefined()
    })
    test(`doesn't throw`, () => {
      expect(() => {
        remove(map, -4)
      }).not.toThrow()
      expect(() => {
        remove(map, 42)
      }).not.toThrow()
      expect(() => {
        remove(map, undefined)
      }).not.toThrow()
    })
  })
  describe("no elements", () => {
    beforeEach(() => {
      map = new MapSchema<string>()
    })
    test(`does nothing`, () => {
      remove(map, 0)

      expect(Object.keys(map)).toEqual([])
      expect(Object.keys(map).length).toBe(0)
    })
    test(`doesn't throw`, () => {
      expect(() => {
        remove(map, 0)
      }).not.toThrow()
      expect(() => {
        remove(map, -4)
      }).not.toThrow()
      expect(() => {
        remove(map, 42)
      }).not.toThrow()
      expect(() => {
        remove(map, Infinity)
      }).not.toThrow()
    })
  })
})
