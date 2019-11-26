import { arrayWith, sortAlphabetically } from "../src/arrays"

test("arrayWith", () => {
  expect(arrayWith(0)).toStrictEqual([])
  expect(arrayWith(3)).toStrictEqual([0, 1, 2])
})

test("sortAlphabetically", () => {
  const array = ["East", "Cry", "Tree"]

  expect(array.sort(sortAlphabetically)).toStrictEqual(["Cry", "East", "Tree"])
})
