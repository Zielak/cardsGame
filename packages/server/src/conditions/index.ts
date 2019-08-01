import { State } from "../state"
import { ServerPlayerEvent } from "../player"
import { logs } from "@cardsgame/utils"
import chalk from "chalk"

export interface ICondition {
  (state: State, event: ServerPlayerEvent): boolean
  _name?: string
}

export * from "./isPlayersTurn"
export * from "./entitiesNameIs"
export * from "./isOwner"
export * from "./matchesPropWith"
export * from "./parentMatches"
export * from "./hasChildren"
export * from "./selectors/childrenOf"
export * from "./hasRevealedUI"
export * from "./propEquals"

const generateName = (
  name: string,
  conditions: ICondition[],
  description?: string
) => {
  const desc = description ? `"${chalk.italic(description)}"\n\t │\t\t` : ""
  return `${desc}${name}( ${conditions.map(c => c._name).join(", ")} )`
}

export function OR(...conditions: ICondition[]): ICondition
export function OR(description: string, ...conditions: ICondition[]): ICondition
export function OR(
  condOrDesc: ICondition | string,
  ...conds: ICondition[]
): ICondition {
  let conditions: ICondition[]
  let description: string = ""
  if (typeof condOrDesc === "string") {
    description = condOrDesc
    conditions = [...conds]
  } else {
    conditions = [condOrDesc, ...conds]
  }

  const OR = (state: State, event: ServerPlayerEvent) => {
    const result = conditions.some(cond => cond(state, event))
    logs.verbose(`│\t\tOR:`, result)
    return result
  }
  OR._name = generateName("OR", conditions, description)
  return OR
}

export function AND(...conditions: ICondition[]): ICondition
export function AND(
  description: string,
  ...conditions: ICondition[]
): ICondition
export function AND(
  condOrDesc: ICondition | string,
  ...conds: ICondition[]
): ICondition {
  let conditions: ICondition[]
  let description: string = ""
  if (typeof condOrDesc === "string") {
    description = condOrDesc
    conditions = [...conds]
  } else {
    conditions = [condOrDesc, ...conds]
  }

  const AND = (state: State, event: ServerPlayerEvent) => {
    const result = conditions.every(cond => cond(state, event))
    logs.verbose(`│\t\tAND:`, result)
    return result
  }
  AND._name = generateName("AND", conditions, description)
  return AND
}

export function NOT(...conditions: ICondition[]): ICondition
export function NOT(
  description: string,
  ...conditions: ICondition[]
): ICondition
export function NOT(
  condOrDesc: ICondition | string,
  ...conds: ICondition[]
): ICondition {
  let conditions: ICondition[]
  let description: string = ""
  if (typeof condOrDesc === "string") {
    description = condOrDesc
    conditions = [...conds]
  } else {
    conditions = [condOrDesc, ...conds]
  }

  const NOT = (state: State, event: ServerPlayerEvent) => {
    const result = !conditions.every(cond => cond(state, event))
    logs.verbose(`│\t\tNOT:`, result)
    return result
  }
  NOT._name = generateName("NOT", conditions, description)
  return NOT
}
