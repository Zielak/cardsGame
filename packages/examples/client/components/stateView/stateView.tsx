import React, { FunctionComponent } from "react"
import "./stateView.scss"
import { StateEntry } from "./stateEntry"

export interface StateViewProps {
  data: { [key: string]: any }
  indent?: boolean
  collapsable?: boolean
}
export const StateView: FunctionComponent<StateViewProps> = props => {
  console.log("new StateView with data:", props.data)

  // useEffect(() => {
  const entries = Object.keys(props.data).map(key => {
    return {
      key: "stateProp" + key,
      name: key,
      value: props.data[key]
    }
  })
  // setEntries(entries)
  // }, [props.data])

  const mainStyles = {
    paddingLeft: props.indent ? "1em" : ""
  }

  return (
    <div style={mainStyles} className="stateView">
      {entries.map(el => (
        <StateEntry
          indent={props.indent}
          collapsable={props.collapsable}
          {...el}
        />
      ))}
    </div>
  )
}
