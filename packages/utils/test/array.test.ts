import {
  arrayWith,
  sortAlphabetically,
  sortAlphaNumerically,
} from "../src/arrays"

test("arrayWith", () => {
  expect(arrayWith(0)).toStrictEqual([])
  expect(arrayWith(3)).toStrictEqual([0, 1, 2])
})

test("sortAlphabetically", () => {
  expect(["East", "Cry", "Tree"].sort(sortAlphabetically)).toStrictEqual([
    "Cry",
    "East",
    "Tree",
  ])
  expect(["Two", "One", "Two"].sort(sortAlphabetically)).toStrictEqual([
    "One",
    "Two",
    "Two",
  ])
})

test("sortAlphaNumerically", () => {
  expect(
    ["2", "zz", "b", "22", "aa", "b", "1", "10", "2"].sort(sortAlphaNumerically)
  ).toStrictEqual(["1", "2", "2", "10", "22", "aa", "b", "b", "zz"])
})
