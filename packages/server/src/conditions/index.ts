import { State } from "../state"
import { ServerPlayerEvent } from "../player"
import { logs, chalk } from "@cardsgame/utils"

const devOrTest =
  process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test"

export interface ICondition extends ConditionResult {
  (state: State, event: ServerPlayerEvent): boolean
}

export interface ConditionResult {
  // Plain name of current Cnodition
  name: string
  description?: string
  // Result of this Condition as a whole
  result?: boolean
  // Results of all underlying Conditions
  subResults?: ConditionResult[]
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
  return `${desc}${name}( ${conditions.map(c => c.name).join(", ")} )`
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

  const OR: ICondition = (state: State, event: ServerPlayerEvent) => {
    if (devOrTest) {
      // TODO: ensure these places get cut out on prod environments
      OR.subResults = []
    }

    const result = conditions.some((cond, idx, arr) => {
      const out = cond(state, event)

      if (devOrTest) {
        const subResult: ConditionResult = {
          name: cond.name,
          result: out
        }
        if (cond.subResults) {
          subResult.subResults = cond.subResults
        }
        OR.subResults.push(subResult)

        if (out) {
          // If this was the last one, grab the names of the remaining conditions
          OR.subResults.push(
            ...arr.slice(idx + 1).map(cond => ({ name: cond.name }))
          )
        }
      }

      return out
    })

    if (devOrTest) {
      OR.result = true
    }

    return result
  }

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

  const AND: ICondition = (state: State, event: ServerPlayerEvent) => {
    if (devOrTest) {
      AND.subResults = []
    }

    const result = conditions.every((cond, idx, arr) => {
      const out = cond(state, event)

      if (devOrTest) {
        const subResult: ConditionResult = {
          name: cond.name,
          result: out
        }
        if (cond.subResults) {
          subResult.subResults = cond.subResults
        }
        AND.subResults.push(subResult)
      }

      return out
    })

    if (devOrTest) {
      AND.result = true
    }

    return result
  }

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

  const NOT: ICondition = (state: State, event: ServerPlayerEvent) => {
    if (devOrTest) {
      NOT.subResults = []
    }

    const result = !conditions.every(cond => {
      const out = cond(state, event)

      if (devOrTest) {
        const subResult: ConditionResult = {
          name: cond.name,
          result: out
        }
        if (cond.subResults) {
          subResult.subResults = cond.subResults
        }
        NOT.subResults.push(subResult)
      }

      return out
    })

    if (devOrTest) {
      NOT.result = true
    }

    return result
  }

  return NOT
}
