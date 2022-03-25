---
id: "modules"
title: "@cardsgame/utils"
sidebar_label: "Exports"
sidebar_position: 0.5
custom_edit_url: null
---

## Enumerations

- [LogLevels](enums/LogLevels.md)

## Classes

- [Logs](classes/Logs.md)

## Array Functions

- [arrayWith](modules.md#arraywith)
- [compare](modules.md#compare)
- [lastItem](modules.md#lastitem)
- [pickMostCommonProp](modules.md#pickmostcommonprop)
- [shuffle](modules.md#shuffle)
- [sortAlphaNumerically](modules.md#sortalphanumerically)
- [sortAlphabetically](modules.md#sortalphabetically)

## Entity Functions

- [pickByIdx](modules.md#pickbyidx)
- [sortByIdx](modules.md#sortbyidx)

## Function Functions

- [noop](modules.md#noop)
- [runAll](modules.md#runall)
- [times](modules.md#times)

## Number Functions

- [cm2px](modules.md#cm2px)
- [decimal](modules.md#decimal)
- [deg2rad](modules.md#deg2rad)
- [limit](modules.md#limit)
- [px2cm](modules.md#px2cm)
- [rad2deg](modules.md#rad2deg)
- [wrap](modules.md#wrap)

## Object Functions

- [deepClone](modules.md#deepclone)
- [omit](modules.md#omit)
- [pick](modules.md#pick)
- [resolve](modules.md#resolve)

## Random Functions

- [randomFloat](modules.md#randomfloat)
- [randomInt](modules.md#randomint)

## String Functions

- [camelCase](modules.md#camelcase)
- [randomName](modules.md#randomname)
- [sentenceCase](modules.md#sentencecase)
- [trim](modules.md#trim)

## Util Functions

- [applyMixins](modules.md#applymixins)
- [compose](modules.md#compose)
- [def](modules.md#def)
- [isMap](modules.md#ismap)
- [isMapLike](modules.md#ismaplike)
- [isSet](modules.md#isset)
- [timeout](modules.md#timeout)

## Variables

### chalk

• `Const` **chalk**: `Chalk`

`Chalk` instance used internally by server-side lib.

> TODO: Hide it from public use?

___

### logs

• `Const` **logs**: `Object` = `logsPreExport`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `debug` | (...`args`: `any`[]) => `void` |
| `error` | (...`args`: `any`[]) => `void` |
| `group` | (...`args`: `any`[]) => `void` |
| `groupCollapsed` | (...`args`: `any`[]) => `void` |
| `groupEnd` | (...`args`: `any`[]) => `void` |
| `info` | (...`args`: `any`[]) => `void` |
| `log` | (...`args`: `any`[]) => `void` |
| `notice` | (...`args`: `any`[]) => `void` |
| `verbose` | (...`args`: `any`[]) => `void` |
| `warn` | (...`args`: `any`[]) => `void` |

## Array Functions

### arrayWith

▸ **arrayWith**(`count`): `number`[]

Returns an array which holds `count` items, each being the index
number starting from 0.

#### Parameters

| Name | Type |
| :------ | :------ |
| `count` | `number` |

#### Returns

`number`[]

___

### compare

▸ **compare**(`arrayA`, `arrayB`): `boolean`

Compares if two arrays contain same elements.

#### Parameters

| Name | Type |
| :------ | :------ |
| `arrayA` | `any`[] |
| `arrayB` | `any`[] |

#### Returns

`boolean`

___

### lastItem

▸ **lastItem**<`T`\>(`array`): `T`

Returns the last item of an array

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `array` | `T`[] |

#### Returns

`T`

___

### pickMostCommonProp

▸ **pickMostCommonProp**<`T`\>(`collection`, `propKey`, `condition?`): [`string`, `number`]

Grabs you most common `propKey` in your `collection` of `T`,
additionally filtering out items which match given optional condition.

Most useful when creating [`BotNeurons`](/api/server/interfaces/BotNeuron)

**`example`**
```ts
const [rank] = pickMostCommonProp(myCards, "rank")
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `collection` | `T`[] |
| `propKey` | `string` |
| `condition?` | (`T`: `any`) => `boolean` |

#### Returns

[`string`, `number`]

a tuple of [`propValue`, `count`]

___

### shuffle

▸ **shuffle**<`T`\>(`array`): `T`[]

Returns new array with items shuffled around.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `array` | `T`[] |

#### Returns

`T`[]

___

### sortAlphaNumerically

▸ **sortAlphaNumerically**(`a`, `b`): `number`

Function for `array.sort()`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | `string` |
| `b` | `string` |

#### Returns

`number`

___

### sortAlphabetically

▸ **sortAlphabetically**(`a`, `b`): `number`

Function for `array.sort()`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | `string` |
| `b` | `string` |

#### Returns

`number`

___

## Entity Functions

### pickByIdx

▸ **pickByIdx**(`idx`): (`child`: `any`) => `boolean`

Finding function, for `find()` iteration

#### Parameters

| Name | Type |
| :------ | :------ |
| `idx` | `number` |

#### Returns

`fn`

▸ (`child`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `child` | `any` |

##### Returns

`boolean`

___

### sortByIdx

▸ **sortByIdx**(`a`, `b`): `number`

Sorting function, for `sort()`

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | `any` |
| `b` | `any` |

#### Returns

`number`

___

## Function Functions

### noop

▸ **noop**(): `void`

#### Returns

`void`

___

### runAll

▸ **runAll**(`functions`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `functions` | `Function`[] | Array of functions to call one by one |

#### Returns

`void`

___

### times

▸ **times**(`length`, `func`): `void`

Executes function multiple times

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `length` | `number` | number of times function will be executed |
| `func` | (`idx`: `number`) => `any` | a function |

#### Returns

`void`

___

## Number Functions

### cm2px

▸ **cm2px**(`value`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`number`

___

### decimal

▸ **decimal**(`value`, `maxZeroes?`): `number`

Limits the number of digits "after comma"

**`example`**
```ts
decimal(10.12345, 2)
// -> 10.12
```

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `value` | `number` | `undefined` |
| `maxZeroes` | `number` | `2` |

#### Returns

`number`

___

### deg2rad

▸ **deg2rad**(`angle`): `number`

Converts degrees to radians

- discuss at: http://locutus.io/php/deg2rad/
- original by: Enrique Gonzalez
- improved by: Thomas Grainger (http://graingert.co.uk)

**`example`**
```ts
deg2rad(45)
// -> 0.7853981633974483
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `angle` | `number` |

#### Returns

`number`

___

### limit

▸ **limit**(`val`, `min?`, `max?`): `number`

Limits `val` to fin within range from `min` to `max`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `val` | `number` | `undefined` |
| `min` | `number` | `0` |
| `max` | `number` | `1` |

#### Returns

`number`

___

### px2cm

▸ **px2cm**(`value`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`number`

___

### rad2deg

▸ **rad2deg**(`angle`): `number`

Converts radians to degrees

- discuss at: http://locutus.io/php/rad2deg/
- original by: Enrique Gonzalez
- improved by: Brett Zamir (http://brett-zamir.me)

**`example`**
```ts
rad2deg(3.141592653589793)
// -> 180
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `angle` | `number` |

#### Returns

`number`

___

### wrap

▸ **wrap**(`val`, `max?`): `number`

Wraps `val` around to fit within 0 and `max`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `val` | `number` | `undefined` |
| `max` | `number` | `1` |

#### Returns

`number`

___

## Object Functions

### deepClone

▸ **deepClone**(`value`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `unknown` |

#### Returns

`any`

___

### omit

▸ **omit**(`object`, `keys`): `Record`<`string`, `any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `object` | `Record`<`string`, `any`\> |
| `keys` | `string`[] |

#### Returns

`Record`<`string`, `any`\>

new object without provided `keys`

___

### pick

▸ **pick**(`object`, `keys`): `Record`<`string`, `any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `object` | `Record`<`string`, `any`\> |
| `keys` | `string`[] |

#### Returns

`Record`<`string`, `any`\>

new object only with provided `keys`

___

### resolve

▸ **resolve**(`sourceObject`, `path`, `separator?`): `any`

Resolves target object/property given source object and path.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `sourceObject` | `Record`<`string`, `any`\> | `undefined` |
| `path` | `string` \| (`string` \| `number`)[] | `undefined` |
| `separator` | `string` | `"."` |

#### Returns

`any`

___

## Random Functions

### randomFloat

▸ **randomFloat**(`min?`, `max?`): `number`

Random float number in range `min` to `max`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `min` | `number` | `0` |
| `max` | `number` | `1` |

#### Returns

`number`

___

### randomInt

▸ **randomInt**(`min?`, `max?`): `number`

Random number  in range `min` to `max`, without the remainder

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `min` | `number` | `0` |
| `max` | `number` | `1` |

#### Returns

`number`

___

## String Functions

### camelCase

▸ **camelCase**(`str?`): `string`

Convert string to "camelCase"

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `str` | `string` | `""` |

#### Returns

`string`

___

### randomName

▸ **randomName**(): `string`

For now it's just 3 random letters

#### Returns

`string`

___

### sentenceCase

▸ **sentenceCase**(`str?`): `string`

Convert string to "SentenceCase" (first letter capital)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `str` | `string` | `""` |

#### Returns

`string`

___

### trim

▸ **trim**(`string?`, `maxLength?`): `string`

Trim long string with nice ell…
Works only on string, don't put numbers in it.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `string` | `string` | `""` |
| `maxLength` | `number` | `7` |

#### Returns

`string`

___

## Util Functions

### applyMixins

▸ **applyMixins**(`derivedCtor`, `baseCtors`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `derivedCtor` | `AnyClass` |
| `baseCtors` | `any`[] |

#### Returns

`void`

___

### compose

▸ **compose**<`T`\>(`value`, ...`functions`): `T`

Calls each function with the current argument
and its result is used for the next call

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `unknown` |
| `...functions` | (...`args`: `any`[]) => `any`[] |

#### Returns

`T`

___

### def

▸ **def**<`T`\>(...`values`): `T`

Returns first, *defined* value

**`example`**
```ts
const options = {}

def(options.value, "default")
// -> "default"
```

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...values` | `T`[] |

#### Returns

`T`

___

### isMap

▸ **isMap**(`thing`): thing is Map<any, any\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `thing` | `unknown` |

#### Returns

thing is Map<any, any\>

___

### isMapLike

▸ **isMapLike**(`thing`): `boolean`

Has somewhat same interface to native Map

#### Parameters

| Name | Type |
| :------ | :------ |
| `thing` | `unknown` |

#### Returns

`boolean`

___

### isSet

▸ **isSet**(`thing`): thing is Set<any\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `thing` | `unknown` |

#### Returns

thing is Set<any\>

___

### timeout

▸ **timeout**(`ms`): `Promise`<`unknown`\>

Simple delay of execution. Use like this: `await timeout(50)`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ms` | `number` | milliseconds |

#### Returns

`Promise`<`unknown`\>
