import { Room, Hand, State, Pile, Deck } from "../../"
import { Container } from "../../entities/container"
import { ContainersTestState } from "./state"
export declare class ContainersTest extends Room<ContainersTestState> {
  name: string
  possibleActions: Set<any>
  container: Container
  pile: Pile
  deck: Deck
  hand: Hand
  onSetupGame(state: ContainersTestState): void
  onStartGame(state: State): void
}
