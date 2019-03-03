import { MakaoState } from "./state"
import { ICommand } from "../../command"

// export class MakaoNextPlayer extends

export class IncreaseAtackPoints implements ICommand {
  lastValue: number

  constructor(private value: number) {}

  execute(state: MakaoState) {
    this.lastValue = state.atackPoints
    state.atackPoints = this.lastValue + this.value
  }

  undo(state: MakaoState) {
    state.atackPoints = this.lastValue
  }
}

export class IncreaseSkipPoints implements ICommand {
  lastValue: number

  constructor(private value: number) {}

  execute(state: MakaoState) {
    this.lastValue = state.skipPoints
    state.skipPoints = this.lastValue + this.value
  }

  undo(state: MakaoState) {
    state.skipPoints = this.lastValue
  }
}

/**
 * TODO: grab all cards from pile,
 * put it on deck and shuffle,
 * put top card to pile nd show it.
 */
export class PrepareNewDeck implements ICommand {
  constructor(private value: number) {}

  execute(state: MakaoState) {}

  undo(state: MakaoState) {}
}

export class SetAtackPoints implements ICommand {
  lastValue: number

  constructor(private value: number) {}

  execute(state: MakaoState) {
    this.lastValue = state.atackPoints
    state.atackPoints = this.value
  }

  undo(state: MakaoState) {
    state.atackPoints = this.lastValue
  }
}

export class SetSkipPoints implements ICommand {
  lastValue: number

  constructor(private value: number) {}

  execute(state: MakaoState) {
    this.lastValue = state.skipPoints
    state.skipPoints = this.value
  }

  undo(state: MakaoState) {
    state.skipPoints = this.lastValue
  }
}
