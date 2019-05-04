import React, { FunctionComponent, useState } from "react"
import "./gameView.scss"
import { ClassicCardView } from "../../entities/classicCard/classicCard"
import { ParentWrapper } from "../../entities/parentWrapper"

interface GameViewProps {
  state: { [key: string]: any }
}

export const GameView: FunctionComponent<GameViewProps> = props => {
  return (
    <section className="gameView">
      <ParentWrapper parentData={props.state}>
        {/* <ClassicCardView faceUp={true} suit="H" rank="3" x={60} y={60} /> */}
      </ParentWrapper>
    </section>
  )
}
