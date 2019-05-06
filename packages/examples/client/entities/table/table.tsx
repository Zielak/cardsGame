import React, { FunctionComponent, CSSProperties } from "react"
import "./table.scss"

interface TableProps {
  width: number
  height: number
}

export const Table: FunctionComponent<TableProps> = props => {
  const styles: CSSProperties = {
    width: props.width + "rem",
    height: props.height + "rem",
    left: `-${props.width / 2}rem`,
    top: `-${props.height / 2}rem`
  }
  return <div className="table" style={styles} />
}
