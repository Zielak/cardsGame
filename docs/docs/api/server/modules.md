---
id: "modules"
title: "@cardsgame/server"
sidebar_label: "Exports"
sidebar_position: 0.5
custom_edit_url: null
---

## Namespaces

- [commands](namespaces/commands.md)
- [entities](namespaces/entities.md)
- [traits](namespaces/traits.md)

## Classes

- [Bot](classes/Bot.md)
- [BotConditions](classes/BotConditions.md)
- [ClientMessageConditions](classes/ClientMessageConditions.md)
- [Command](classes/Command.md)
- [Conditions](classes/Conditions.md)
- [EntityConditions](classes/EntityConditions.md)
- [Player](classes/Player.md)
- [Room](classes/Room.md)
- [State](classes/State.md)
- [TargetHolder](classes/TargetHolder.md)
- [TargetsHolder](classes/TargetsHolder.md)

## Interfaces

- [ActionTemplate](interfaces/ActionTemplate.md)
- [BotNeuron](interfaces/BotNeuron.md)
- [IRoom](interfaces/IRoom.md)

## Annotation Functions

- [canBeChild](modules.md#canbechild)
- [containsChildren](modules.md#containschildren)

## Conditions Functions

- [getFlag](modules.md#getflag)

## Other Functions

- [defineTypes](modules.md#definetypes)
- [isInteractionOfEntities](modules.md#isinteractionofentities)
- [isInteractionOfEvent](modules.md#isinteractionofevent)
- [populatePlayerEvent](modules.md#populateplayerevent)
- [setFlag](modules.md#setflag)
- [testAction](modules.md#testaction)
- [type](modules.md#type)

## State Functions

- [getAllBots](modules.md#getallbots)
- [getEntitiesAlongPath](modules.md#getentitiesalongpath)
- [getNextPlayer](modules.md#getnextplayer)
- [getNextPlayerIdx](modules.md#getnextplayeridx)
- [getPlayerByName](modules.md#getplayerbyname)
- [getPlayersIndex](modules.md#getplayersindex)
- [getPreviousPlayer](modules.md#getpreviousplayer)
- [getPreviousPlayerIdx](modules.md#getpreviousplayeridx)

## Type aliases

### ActionsSet

Ƭ **ActionsSet**<`S`\>: `Set`<[`ActionTemplate`](interfaces/ActionTemplate.md)<`S`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends [`State`](classes/State.md) |

___

### ServerPlayerMessage

Ƭ **ServerPlayerMessage**: `ClientPlayerMessage` & { `entities?`: `unknown`[] ; `entity?`: `unknown` ; `player?`: [`Player`](classes/Player.md) ; `timestamp`: `number`  }

___

### Target

Ƭ **Target**<`T`\>: `T` \| () => `T`

#### Type parameters

| Name |
| :------ |
| `T` |

___

### Targets

Ƭ **Targets**<`T`\>: `T` \| `T`[] \| () => `T` \| `T`[]

#### Type parameters

| Name |
| :------ |
| `T` |

## Annotation Functions

### canBeChild

▸ **canBeChild**(`childConstructor`): `void`

Decorator!
Register an entity class as possible child for any other parent entities.

#### Parameters

| Name | Type |
| :------ | :------ |
| `childConstructor` | `AnyClass` |

#### Returns

`void`

___

### containsChildren

▸ **containsChildren**(`childrenSynced?`): (`parentConstructor`: typeof `Entity`) => `void`

Class Decorator!
Remember as possible parent to any kinds of children entities
Also enables syncing any previously remembered children kind on this constructor

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `childrenSynced` | `boolean` | `true` | set `false` to keep list of children secret from clients |

#### Returns

`fn`

▸ (`parentConstructor`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `parentConstructor` | typeof `Entity` |

##### Returns

`void`

___

## Conditions Functions

### getFlag

▸ **getFlag**(`target`, `flagName`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `Record`<`string`, `any`\> |
| `flagName` | `ConditionsFlag` |

#### Returns

`any`

___

## Other Functions

### defineTypes

▸ **defineTypes**(`target`, `fields`, `context?`): typeof `Schema`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | typeof `Schema` |
| `fields` | `Object` |
| `context?` | `Context` |

#### Returns

typeof `Schema`

___

### isInteractionOfEntities

▸ **isInteractionOfEntities**<`S`\>(`o`): o is EntitiesActionTemplate<S\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends [`State`](classes/State.md)<`S`\> = `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `o` | `unknown` |

#### Returns

o is EntitiesActionTemplate<S\>

___

### isInteractionOfEvent

▸ **isInteractionOfEvent**<`S`\>(`o`): o is EventActionTemplate<S\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends [`State`](classes/State.md)<`S`\> = `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `o` | `unknown` |

#### Returns

o is EventActionTemplate<S\>

___

### populatePlayerEvent

▸ **populatePlayerEvent**(`state`, `message`, `clientID`): [`ServerPlayerMessage`](modules.md#serverplayermessage)

Converts players message from the Client into `ServerPlayerMessage`.
Populates message with known server-side data

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`State`](classes/State.md) |
| `message` | `ClientPlayerMessage` |
| `clientID` | `string` |

#### Returns

[`ServerPlayerMessage`](modules.md#serverplayermessage)

▸ **populatePlayerEvent**(`state`, `message`, `player`): [`ServerPlayerMessage`](modules.md#serverplayermessage)

Converts players message from the Client into `ServerPlayerMessage`.
Populates message with known server-side data

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`State`](classes/State.md) |
| `message` | `ClientPlayerMessage` |
| `player` | [`Player`](classes/Player.md) |

#### Returns

[`ServerPlayerMessage`](modules.md#serverplayermessage)

___

### setFlag

▸ **setFlag**(`target`, `flagName`, `value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `Record`<`string`, `any`\> |
| `flagName` | `ConditionsFlag` |
| `value` | `unknown` |

#### Returns

`void`

___

### testAction

▸ **testAction**<`S`\>(`action`, `state`, `message`): `boolean`

Tests if given action would pass tests when pushed to Commands Manager

#### Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends [`State`](classes/State.md)<`S`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `action` | [`ActionTemplate`](interfaces/ActionTemplate.md)<`S`\> |
| `state` | `S` |
| `message` | [`ServerPlayerMessage`](modules.md#serverplayermessage) |

#### Returns

`boolean`

___

### type

▸ **type**(`typeDef`, `typesContext?`): `PropertyDecorator`

#### Parameters

| Name | Type |
| :------ | :------ |
| `typeDef` | `DefinitionType` |
| `typesContext?` | `Context` |

#### Returns

`PropertyDecorator`

___

## State Functions

### getAllBots

▸ **getAllBots**(`state`): [`Bot`](classes/Bot.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`State`](classes/State.md) |

#### Returns

[`Bot`](classes/Bot.md)[]

___

### getEntitiesAlongPath

▸ **getEntitiesAlongPath**(`state`, `path`): [`IdentityTrait`](classes/traits.IdentityTrait.md)[]

Gets an array of all entities from the top-most parent
to the lowest of the child.

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`State`](classes/State.md) |
| `path` | `number`[] |

#### Returns

[`IdentityTrait`](classes/traits.IdentityTrait.md)[]

___

### getNextPlayer

▸ **getNextPlayer**(`state`): [`Player`](classes/Player.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`State`](classes/State.md) |

#### Returns

[`Player`](classes/Player.md)

___

### getNextPlayerIdx

▸ **getNextPlayerIdx**(`state`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`State`](classes/State.md) |

#### Returns

`number`

___

### getPlayerByName

▸ **getPlayerByName**(`state`, `name`): [`Player`](classes/Player.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`State`](classes/State.md) |
| `name` | `string` |

#### Returns

[`Player`](classes/Player.md)

___

### getPlayersIndex

▸ **getPlayersIndex**(`state`, `player`): `number`

Will get you an index of given player in turn queue.
Useful if you happen to have just a `Player` reference at hand.

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`State`](classes/State.md) |
| `player` | [`Player`](classes/Player.md) |

#### Returns

`number`

___

### getPreviousPlayer

▸ **getPreviousPlayer**(`state`): [`Player`](classes/Player.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`State`](classes/State.md) |

#### Returns

[`Player`](classes/Player.md)

___

### getPreviousPlayerIdx

▸ **getPreviousPlayerIdx**(`state`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`State`](classes/State.md) |

#### Returns

`number`
