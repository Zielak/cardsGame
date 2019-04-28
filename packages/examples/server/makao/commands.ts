import { commands } from "@cardsgame/server"
import { MakaoState } from "./state"

export class IncreaseAtackPoints implements commands.ICommand {
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

export class IncreaseSkipPoints implements commands.ICommand {
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

export class SetAtackPoints implements commands.ICommand {
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

export class SetSkipPoints implements commands.ICommand {
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

export class SetRequestedSuit implements commands.ICommand {
  lastValue: string

  constructor(private value: string) {}

  execute(state: MakaoState) {
    this.lastValue = state.requestedSuit
    state.requestedSuit = this.value
  }

  undo(state: MakaoState) {
    state.requestedSuit = this.lastValue
  }
}

export class SetRequestedRank implements commands.ICommand {
  lastValue: string

  constructor(private value: string) {}

  execute(state: MakaoState) {
    this.lastValue = state.requestedRank
    state.requestedRank = this.value
  }

  undo(state: MakaoState) {
    state.requestedRank = this.lastValue
  }
}

export class RevealUI implements commands.ICommand {
  lastUiName: string
  lastUiValue: string

  constructor(private uiName: string, private clientID?: string) {}

  execute(state: MakaoState) {
    const update = (uiName: string) => {
      this.lastUiName = uiName
      this.lastUiValue = state.ui[uiName]
      state.ui[uiName] = this.clientID || state.currentPlayer.clientID
    }
    update(this.uiName)
  }

  undo(state: MakaoState) {
    state.ui[this.lastUiName] = this.lastUiValue
  }
}

export class HideUI implements commands.ICommand {
  lastUiName: string
  lastUiValue: string

  constructor(private uiName: string) {}

  execute(state: MakaoState) {
    this.lastUiName = this.uiName
    this.lastUiValue = state.ui[this.uiName]
    state.ui[this.uiName] = ""
  }

  undo(state: MakaoState) {
    state.ui[this.lastUiName] = this.lastUiValue
  }
}

/**
 * TODO: grab all cards from pile,
 * put it on deck and shuffle,
 * put top card to pile nd show it.
 */
export class PrepareNewDeck implements commands.ICommand {
  constructor(private value: number) {}

  execute(state: MakaoState) {}

  undo(state: MakaoState) {}
}
