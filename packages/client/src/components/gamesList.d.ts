/// <reference types="node" />
import React from "react"
import "./gamesList.scss"
export interface GamesListProps {
  joinRoom(gameName: string): any
  getAvailableRooms(
    roomName: string,
    callback: (rooms: any, err?: string) => any
  ): any
  gameNames: string[]
}
export declare class GamesList extends React.Component<GamesListProps, {}> {
  timerID: NodeJS.Timeout
  constructor(props: GamesListProps)
  componentDidMount(): void
  componentWillUnmount(): void
  render(): JSX.Element
}
