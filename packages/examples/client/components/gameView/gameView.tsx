import React, { FunctionComponent, useState } from "react"
import "./gameView.scss"
import { ClassicCardView } from "../../entities/classicCard/classicCard"

interface GameViewProps {
  state: { [key: string]: any }
}

export const GameView: FunctionComponent<GameViewProps> = props => {
  return (
    <div className="gameView">
      <ClassicCardView faceUp={true} suit="H" rank="3" />
    </div>
  )
}
