---
id: "entities"
title: "Namespace: entities"
sidebar_label: "entities"
sidebar_position: 0
custom_edit_url: null
---

## Classes

- [ClassicCard](../classes/entities.ClassicCard.md)
- [Container](../classes/entities.Container.md)
- [Deck](../classes/entities.Deck.md)
- [Grid](../classes/entities.Grid.md)
- [Hand](../classes/entities.Hand.md)
- [Line](../classes/entities.Line.md)
- [Pile](../classes/entities.Pile.md)
- [Spread](../classes/entities.Spread.md)

## Grid Functions

- [isGrid](entities.md#isgrid)

## Other Functions

- [standardDeckFactory](entities.md#standarddeckfactory)

## Grid Functions

### isGrid

▸ **isGrid**(`entity`): entity is Grid

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `unknown` |

#### Returns

entity is Grid

___

## Other Functions

### standardDeckFactory

▸ **standardDeckFactory**(`ranks?`, `suits?`): [`ClassicCard`](../classes/entities.ClassicCard.md)[]

Will generate an array of card options.
Use this array to create actual cards yourself

**`example`**
```ts
standardDeckFactory().map(options => {
  new ClassicCard({state, ...options})
})
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ranks` | `string`[] | array of desired ranks |
| `suits` | `string`[] | array of desired suits |

#### Returns

[`ClassicCard`](../classes/entities.ClassicCard.md)[]
