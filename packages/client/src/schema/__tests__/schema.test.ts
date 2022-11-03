import type { ObjectSchema } from "../types.js"

type SubjectTop = {
  name: string
  idx: number
}

type SubjectProps = {
  name: string
  top?: SubjectTop
  idx?: number
}

test("ObjectSchema", () => {
  // Expect these types to not change and be valid
  const subject: ObjectSchema<SubjectProps> = {
    name: "Testing subject",
    top: {
      name: "Top of testing subject",
      _definition: { schema: { name: "string" } },
      listen: (p, c) => () => {},
      onChange: () => {},
    },
    _definition: { schema: { name: "string" } },
    listen: (p, c) => () => {},
    onChange: () => {},
  }

  expect(typeof subject.name).toBe("string")

  expect(() => subject.top.name).not.toThrow()
  expect(() => {
    subject.listen("name", (newName, previousName) => {
      newName
    })
  }).not.toThrow()
})
