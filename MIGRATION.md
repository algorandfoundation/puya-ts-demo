## Nominal Changes

These are changes to the way things are named, but the functionality remains the same. This list is not exhaustive.

| TEALScript                           | PuyaTS                        | Notes                                            |
| ------------------------------------ | ----------------------------- | ------------------------------------------------ |
| `GlobalStateKey`                     | `GlobalState`                 |                                                  |
| `LocalStateKey`                      | `LocalState`                  |                                                  |
| `BoxKey`                             | `BoxRef`                      |                                                  |
| `prefix`                             | `keyPrefix`                   | The prefix option for BoxMap                     |
| `this.txn`                           | `Txn`                         |                                                  |
| `this.app`                           | `Global.currentApplicationId` |                                                  |
| `isOptedInToApp`, `isOptedInToAsset` | `isOptedIn`                   | The Puya function accepts a union of these types |
| `size`                               | `length`                      | The size of a box                                |

## Minor Changes

These are minor changes to the syntax of the language/API. This list is not exhaustive.

| TEALScript                                      | PuyaTS                                       | Notes                                                                                            |
| ----------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `this.boxRef.create(boxSize)`                   | `this.boxRef.create({ size: boxSize })`      | The size option is now a property of the create method                                           |
| Explcicit method return types are required      | Implicit method return types are allowed     |                                                                                                  |
| `verify...Txn`                                  | `assertMatch`                                | `assertMatch` accepts any object. This means, however, that txn types must be explicitly checked |
| Methods, classes, and types are in global scope | Methods, classes, and types must be imported |                                                                                                  |

## Major Changes

These are major changes to the syntax of the language/API.

### Method Routing

#### TEALScript

Each action (OnCompletes and create) has a method name that is used to route to the correct method when that action/OC is performed.

```ts
createApplication() {
```

Alternatively, decorators can be used for more complex contracts

```ts
@allow.create('NoOp')
myCustomCreateMethod() {
```

#### PuyaTS

Decorators must be used to specify the action/OC.

```ts
@abimethod({ onCreate: "require", allowActions: "NoOp" })
createApplication() {
```

### Math Typing

#### TEALScript

TEALScript supports math operators on any `uint<n>` type and returns the result as the same type.

```ts
getSum(x: uint64, y: uint64): uint64 {
    const sum = x + y;
    return sum;
}
```

#### PuyaTS

PuyaTS requires explicit usage of a constructor to return the result of a math operation.

```ts
getSum(x: uint64, y: uint64): uint64 {
    const sum = UintN<64>(x + y);
    return sum;
}
```

### As Casting

#### TEALScript

TEALScript allows casting between types using the `as` keyword.

```ts
const x: uint8 = 10;
const y = x as uint64;
```

#### PuyaTS

PuyaTS does not support casting between types with `as`. Instead, the respective constructor must be used.

```ts
const x: uint8 = 10;
const y = UintN<64>(x);
```

### String vs Bytes

#### TEALScript

In TEALScript, bytes and strings are the same type and can be used interchangeably.

```ts
assert(swapAsset.assetName === "SWAP");
```

#### PuyaTS

In PuyaTS, bytes and strings are distinct types. Most functions acccept `bytes | string`, but outputs will always be `bytes`

```ts
assert(swapAsset.assetName === Bytes("SWAP"));
```

### Array Mutability

#### TEALScript

TEALScript supports mutable arrays

```ts
const myArray: uint64[] = [1, 2, 3];
myArray.push(4);
```

#### PuyaTS

PuyaTS arrays are always immutable

```ts
let myArray: uint64[] = [1, 2, 3];
myArray = [...myArray, 4];
```

### Objects vs Structs

#### TEALScript

TEALScript supports the use of JavaScript objects

```ts
type ListingKey {
    owner: Address,
    asset: AssetID,
    nonce: uint64
}
```

```ts
deposit(xfer: AssetTransferTransaction, nonce: uint64) {
    const key: ListingKey = { 
      owner: this.txn.sender,
      asset: xfer.xferAsset,
      nonce: nonce
    }
```

#### PuyaTS

PuyaTS does not support the use of JavaScript objects. Instead, structs must be used and each struct field must be an ARC4 type.

```ts
export class ListingKey extends arc4.Struct<{
  owner: arc4.Address
  asset: arc4.UintN64
  nonce: arc4.UintN64
}> {}
```

```ts
deposit(xfer: gtxn.AssetTransferTxn, nonce: arc4.UintN64) {
    const key = new ListingKey({
        owner: new arc4.Address(Txn.sender),
        asset: new arc4.UintN64(xfer.xferAsset.id),
        nonce: nonce,
    })
```
