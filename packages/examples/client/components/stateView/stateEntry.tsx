import React, { FunctionComponent, useState, useEffect, Fragment } from "react"
import { Button } from "../button/button"
import { decimal } from "@cardsgame/utils"
import { StateView } from "./stateView"

export interface IStateEntryProps {
  name: string
  value: any
  indent?: boolean
  collapsable?: boolean
}

export const StateEntry: FunctionComponent<IStateEntryProps> = props => {
  const printAsString = val => `"${val}"`
  const printAsNumber = val => `${val}`
  const printAsArray = val => `${val.join(",")}`

  const parseArray = (obj: any) => {
    return Object.values(obj).map(el => parseObject(el))
  }

  const parseObject = (obj: any) => {
    const childrenProps = [
      "childrenClassicCard",
      "childrenPile",
      "childrenDeck",
      "childrenHand"
    ]
    // All props handled differently
    const blackListedProps = [
      "idx",
      "suit",
      "rank",
      "type",
      "name",
      "width",
      "height",
      "x",
      "y",
      "angle",
      "clientID",
      ...childrenProps
    ]
    const data: any = {}

    if (typeof obj === "string") return obj
    if (typeof obj === "number") return printAsNumber(obj)
    if (typeof obj === "object" && Array.isArray(obj)) return printAsArray(obj)

    // Entity-like element?
    if (obj.type && obj.name) {
      data[`[${obj.idx}]`] = `${obj.name}:${obj.type}`
    }

    if (obj.type === "classicCard") {
      data.name = obj.name
      data.faceUp = obj.faceUp
    }
    // Position
    if ("x" in obj) {
      data.pos = `${decimal(obj.x, 1)}, ${decimal(obj.y, 1)}, ${decimal(
        obj.angle,
        0
      )}°`
    }

    // Player
    if ("clientID" in obj) {
      data[obj.clientID] = `name: ${obj.name}`
      data.score = obj.score
    }

    const children = Object.keys(obj)
      .filter(key => childrenProps.includes(key))
      .reduce((prev, key) => prev.concat(obj[key]), [])
      .sort((a, b) => a.idx - b.idx)

    if (children.length) {
      data.children = children
    }

    Object.keys(obj)
      .filter(key => !blackListedProps.includes(key))
      .forEach(key => (data[key] = obj[key]))

    return data
  }

  const [data, setData] = useState(undefined)
  const [type, setType] = useState("undefined")
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof props.value === "object") {
      if ("0" in props.value || Array.isArray(props.value)) {
        setType("array")
        const parsed = parseArray(props.value)
        setData(parsed)
        console.log("[]", props.name.toUpperCase(), parsed)
      } else {
        setType("object")
        const parsed = parseObject(props.value)
        setData(parsed)
        console.log("{}", props.name.toUpperCase(), parsed)
      }
    } else {
      setType(typeof props.value)
    }
  }, [props.value])

  return (
    <div>
      {(type === "object" || type === "array") && (
        <Button onClick={() => setVisible(!visible)} noPadding={true}>
          <code>
            "{props.name}": {visible ? "[-]" : "[+]"}
          </code>
        </Button>
      )}
      {type === "object" && visible && <StateView data={data} indent={true} />}
      {type === "array" && visible && <StateView data={data} indent={true} />}
      {type === "string" && (
        <code>
          "{props.name}": {printAsString(props.value)}
        </code>
      )}
      {type === "number" && (
        <code>
          "{props.name}": {printAsNumber(props.value)}
        </code>
      )}
      {type === "undefined" && <code>"{props.name}": undefined</code>}
    </div>
  )
}
