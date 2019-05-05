import React, { FunctionComponent, useState } from "react"
import "./gameView.scss"
import { ParentWrapper } from "../../entities/parentWrapper/parentWrapper"

interface GameViewProps {
  state: { [key: string]: any }
}

export const GameView: FunctionComponent<GameViewProps> = props => {
  document.documentElement.style.setProperty("font-size", "1px")

  return (
    <section className="gameView">
      <ParentWrapper parentData={props.state}>
        {/* <ClassicCardView faceUp={true} suit="H" rank="3" x={60} y={60} /> */}
      </ParentWrapper>
    </section>
  )
}
