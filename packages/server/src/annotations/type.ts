import {
  Context,
  DefinitionType,
  Schema,
  type as colType,
} from "@colyseus/schema"
// import { globalContext } from "@colyseus/schema/lib/annotations"

import { globalEntitiesContext } from "./entitiesContext.js"

export function type(
  typeDef: DefinitionType,
  typesContext?: Context
): PropertyDecorator {
  return function (target: typeof Schema, field: string): void {
    const constructor = target.constructor as typeof Schema
    const context = globalEntitiesContext

    // Intercept type definition
    if (field.indexOf("children") !== 0) {
      if (!context.registeredTypeDefinitions.has(constructor.name)) {
        context.registeredTypeDefinitions.set(constructor.name, new Map())
      }
      // logs.debug("child type:", `${constructor.name}.${field} ${logType}`)
      context.registeredTypeDefinitions
        .get(constructor.name)
        .set(field, typeDef)
    }

    return colType(typeDef, typesContext)(target, field)
  }
}

export function defineTypes(
  target: typeof Schema,
  fields: { [property: string]: DefinitionType },
  context?: Context // = globalContext
): typeof Schema {
  for (const field in fields) {
    type(fields[field], context)(target.prototype, field)
  }
  return target
}
