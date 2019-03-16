import { State } from "../state"
import { ICondition } from "../condition"
import { ServerPlayerEvent } from "../player"
import { logs } from "../logs"
import chalk from "chalk"

export * from "./isPlayersTurn"
export * from "./matchesRankWithPile"
export * from "./matchesSuitWithPile"
export * from "./targetsNameIs"
export * from "./isOwner"
export * from "./isSelected"
export * from "./hasAtLeastXEntitiesSelected"
export * from "./matchesSelectedWith"
export * from "./matchesPropWith"
export * from "./parentIs"
export * from "./hasChildren"
export * from "./selectors/selectedEntities"
export * from "./selectors/childrenOf"

const generateName = (
  name: string,
  conditions: ICondition[],
  description?: string
) => {
  const desc = description ? `"${chalk.italic(description)}"\n\t │\t\t` : ""
  return `${desc}${name}( ${conditions.map(c => c._name).join(", ")} )`
}

function OR(...conditions: ICondition[]): ICondition
function OR(description: string, ...conditions: ICondition[]): ICondition
function OR(
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

function AND(...conditions: ICondition[]): ICondition
function AND(description: string, ...conditions: ICondition[]): ICondition
function AND(
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

function NOT(...conditions: ICondition[]): ICondition
function NOT(description: string, ...conditions: ICondition[]): ICondition
function NOT(
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

export { OR, AND, NOT }
