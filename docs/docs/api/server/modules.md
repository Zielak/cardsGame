---
id: "modules"
title: "@cardsgame/server"
sidebar_label: "Exports"
sidebar_position: 0.5
custom_edit_url: null
---

## Namespaces

- [commands](namespaces/commands.md)

## Entity Classes

- [ClassicCard](classes/ClassicCard.md)
- [Container](classes/Container.md)
- [Deck](classes/Deck.md)
- [Grid](classes/Grid.md)
- [Hand](classes/Hand.md)
- [Line](classes/Line.md)
- [Pile](classes/Pile.md)
- [Spread](classes/Spread.md)

## Other Classes

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

## Trait Classes

- [BoxModelTrait](classes/BoxModelTrait.md)
- [ChildTrait](classes/ChildTrait.md)
- [Entity](classes/Entity.md)
- [FlexyTrait](classes/FlexyTrait.md)
- [IdentityTrait](classes/IdentityTrait.md)
- [LabelTrait](classes/LabelTrait.md)
- [LocationTrait](classes/LocationTrait.md)
- [OwnershipTrait](classes/OwnershipTrait.md)
- [ParentTrait](classes/ParentTrait.md)
- [SelectableChildrenTrait](classes/SelectableChildrenTrait.md)
- [TwoSidedTrait](classes/TwoSidedTrait.md)

## Interfaces

- [ActionTemplate](interfaces/ActionTemplate.md)
- [BotNeuron](interfaces/BotNeuron.md)
- [IRoom](interfaces/IRoom.md)
- [QuerableProps](interfaces/QuerableProps.md)

## Annotation Functions

- [canBeChild](modules.md#canbechild)
- [containsChildren](modules.md#containschildren)

## Conditions Functions

- [getFlag](modules.md#getflag)

## Grid Functions

- [isGrid](modules.md#isgrid)

## Other Functions

- [applyTraitsMixins](modules.md#applytraitsmixins)
- [defineTypes](modules.md#definetypes)
- [executeHook](modules.md#executehook)
- [hasSelectableChildren](modules.md#hasselectablechildren)
- [isInteractionOfEntities](modules.md#isinteractionofentities)
- [isInteractionOfEvent](modules.md#isinteractionofevent)
- [populatePlayerEvent](modules.md#populateplayerevent)
- [setFlag](modules.md#setflag)
- [standardDeckFactory](modules.md#standarddeckfactory)
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

## Trait Functions

- [hasChildren](modules.md#haschildren)
- [hasIdentity](modules.md#hasidentity)
- [hasLabel](modules.md#haslabel)
- [hasOwnership](modules.md#hasownership)
- [isChild](modules.md#ischild)
- [isParent](modules.md#isparent)

## Type aliases

### ActionsSet

Ƭ **ActionsSet**<`S`\>: `Set`<[`ActionTemplate`](interfaces/ActionTemplate.md)<`S`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends [`State`](classes/State.md) |

___

### ChildAddedHandler

Ƭ **ChildAddedHandler**: (`child`: [`ChildTrait`](classes/ChildTrait.md)) => `void`

#### Type declaration

▸ (`child`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `child` | [`ChildTrait`](classes/ChildTrait.md) |

##### Returns

`void`

___

### ChildRemovedHandler

Ƭ **ChildRemovedHandler**: (`idx`: `number`) => `void`

#### Type declaration

▸ (`idx`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `idx` | `number` |

##### Returns

`void`

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

▸ **containsChildren**(`childrenSynced?`): (`parentConstructor`: typeof [`Entity`](classes/Entity.md)) => `void`

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
| `parentConstructor` | typeof [`Entity`](classes/Entity.md) |

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

### applyTraitsMixins

▸ **applyTraitsMixins**(`baseCtors`): (`derivedCtor`: `AnyClass`) => `void`

Mixes all the base constructors prototypes into one.
Also provides a way for Entity to automatically execute
all of the base constructor's "Trait Constructors".

#### Parameters

| Name | Type |
| :------ | :------ |
| `baseCtors` | `any`[] |

#### Returns

`fn`

▸ (`derivedCtor`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `derivedCtor` | `AnyClass` |

##### Returns

`void`

___

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

### executeHook

▸ **executeHook**(`hookName`, ...`args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `hookName` | `string` |
| `...args` | `any`[] |

#### Returns

`void`

___

### hasSelectableChildren

▸ **hasSelectableChildren**(`entity`): entity is SelectableChildrenTrait

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `unknown` |

#### Returns

entity is SelectableChildrenTrait

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

### standardDeckFactory

▸ **standardDeckFactory**(`ranks?`, `suits?`): [`ClassicCard`](classes/ClassicCard.md)[]

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

[`ClassicCard`](classes/ClassicCard.md)[]

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

▸ **getEntitiesAlongPath**(`state`, `path`): [`IdentityTrait`](classes/IdentityTrait.md)[]

Gets an array of all entities from the top-most parent
to the lowest of the child.

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`State`](classes/State.md) |
| `path` | `number`[] |

#### Returns

[`IdentityTrait`](classes/IdentityTrait.md)[]

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

___

## Trait Functions

### hasChildren

▸ **hasChildren**(`entity`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `unknown` |

#### Returns

`boolean`

___

### hasIdentity

▸ **hasIdentity**(`entity`): entity is IdentityTrait

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `any` |

#### Returns

entity is IdentityTrait

___

### hasLabel

▸ **hasLabel**(`entity`): entity is LabelTrait

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `unknown` |

#### Returns

entity is LabelTrait

___

### hasOwnership

▸ **hasOwnership**(`entity`): entity is OwnershipTrait

Entity with this trait can have a reference to `Player`, who "owns" this entity.

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `unknown` |

#### Returns

entity is OwnershipTrait

___

### isChild

▸ **isChild**(`entity`): entity is ChildTrait

**Important trait**

Entity can become a child of any other container/parent.

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `unknown` |

#### Returns

entity is ChildTrait

___

### isParent

▸ **isParent**(`entity`): entity is ParentTrait

**Important trait**

Entity will behave as container to hold all other entities with `ChildTrait`.

Has many methods for adding, fetching, removing and manipulating order of children.

Can behave as:

- an array - all children are indexed next to each other
- a map - there can be empty spaces between children

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `unknown` |

#### Returns

entity is ParentTrait
