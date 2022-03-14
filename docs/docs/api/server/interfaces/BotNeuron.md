---
id: "BotNeuron"
title: "Interface: BotNeuron<S>"
sidebar_label: "BotNeuron"
sidebar_position: 0
custom_edit_url: null
---

## Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends [`State`](../classes/State.md) |

## Properties

### action

• `Optional` **action**: [`ActionTemplate`](ActionTemplate.md)<`S`\>

`ActionTemplate` associated with this Neuron.

___

### children

• `Optional` **children**: [`BotNeuron`](BotNeuron.md)<`S`\>[]

Child neurons of this one.

FIXME: Verify programmatically, that you defined either `action` OR `neurons`...

TODO: BotNeuron Definition Parser?

___

### description

• `Optional` **description**: `string`

___

### entitiesFilter

• `Optional` **entitiesFilter**: (`con`: [`EntityConditions`](../classes/EntityConditions.md)<`S`\>) => `void` \| `QuerableProps`[]

If your action targets `entities` too broadly, add additional filter here.

Can simply be additional `QuerableProps` object, or more advanced function
of conditions - subject is automatically set to each entity.

___

### name

• **name**: `string`

___

### thinkScale

• `Optional` **thinkScale**: `number`

Scale up/down the time it takes the bot to act on this neuron.

## Methods

### conditions

▸ `Optional` **conditions**(`con`): `void`

Additional conditions to guide bot in the right direction.
`Conditions` here is limited, you can only assess current player and game state.

Optional, use as _"energy saver"_.
For example, if an action requires player to have certain kind of card
in their hand, you can quickly assert that here.
Otherwise, bot will brute force its way through all game elements
to understand if this action can be played.

#### Parameters

| Name | Type |
| :------ | :------ |
| `con` | [`BotConditions`](../classes/BotConditions.md)<`S`\> |

#### Returns

`void`

___

### playerEventData

▸ `Optional` **playerEventData**(`state`, `bot`): `any`

Make bot generate additional `data`, if needed.
Will be passed to `ClientPlayerMessage.data`

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `S` |
| `bot` | [`Bot`](../classes/Bot.md) |

#### Returns

`any`

___

### value

▸ **value**(`state`, `bot`): `number`

With higher values bot is more likely to pick that Neuron.

Bots may try to pick the same child-Neuron multiple times in a row,
if the game still allows it (eg.: picking multiple cards of the same rank).

Optional, by default the value is considered to be `0`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `S` |
| `bot` | [`Bot`](../classes/Bot.md) |

#### Returns

`number`
