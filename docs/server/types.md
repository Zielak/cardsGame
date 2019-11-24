## QuerableProps

Interface used to search for an entity. An object of props, which appear in every kind of trait, with an addition of `parent` prop, with which we can also describe the parent of an entity.

```typescript
export interface QuerableProps
  extends Partial<
    Pick<
      EveryTrait,
      | "width"
      | "height"
      | "idx"
      | "alignItems"
      | "directionReverse"
      | "justifyContent"
      | "name"
      | "type"
      | "x"
      | "y"
      | "angle"
      | "owner"
      | "ownerID"
      | "isInOwnersView"
      | "hijacksInteractionTarget"
      | "faceUp"
    >
  > {
  parent?: EntityID | QuerableProps
}
```
