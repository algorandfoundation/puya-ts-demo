# Migrating from TealScript to Algorand TypeScript

## What?

Algorand TypeScript is a new language built on the [Puya compiler architecture](https://github.com/algorandfoundation/puya/blob/main/ARCHITECTURE.md) for developing Algorand Smart Contracts and Logic Signatures in TypeScript.

## Why?

TealScript is a one-shot compiler converting AST parsed by the TypeScript compiler directly to Teal code output. This architecture makes it impossible to share compiler code for multiple front end languages increasing the maintenance overhead of supporting said languages.

Puya, whilst initially built to support Algorand Python has been architected as a multi-stage compiler with various Intermediate Representations (IR). Several of these stages include code optimizations that any front end language can take advantage of along with abstracting away some of the more complex concepts of compiler development. Some examples of these optimizations include:

- Constant value propagation
- Dead code removal
- Subroutine inlining
- Repeated code elimination
- Intrinsic op simplification

[Puya-ts](https://github.com/algorandfoundation/puya-ts) is the new compiler built to take advantage of the Puya base compiler. As part of building puya-ts, we also took the chance to design Algorand TypeScript as the new supported language. It was built taking inspiration from the learnings of TealScript but differs in several ways which can best be summarised as:

- Changes that were necessary to support the design goal of Semantic Compatability
- Changes that were desirable to more closely align Algorand TypeScript with Algorand Python
- Changes where we felt we could improve upon the approach used by TealScript

You can read more about Algorand TypeScript language and its design [here](https://github.com/algorandfoundation/puya-ts/blob/main/docs/language-guide.md). The rest of this document focuses on highlighting differences between Algorand TypeScript and TealScript to aid in migration between the two languages.

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

| TEALScript                                      | PuyaTS                                       | Notes                                                                                                                                                                         |
| ----------------------------------------------- | -------------------------------------------- |-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `this.boxRef.create(boxSize)`                   | `this.boxRef.create({ size: boxSize })`      | The size option is now a property of the create method, this removes ambiguity between creating a box of a specific size vs. creating a box to store a specific uint64 value. |
| Explcicit method return types are required      | Implicit method return types are allowed     | Where the return type can be inferred as a supported type, explicit annotations are not necessary.                                                                            |
| `verify...Txn`                                  | `assertMatch`                                | `assertMatch` accepts any object and will build a compound expression for each clause on the RHS.                                                                             |
| Methods, classes, and types are in global scope | Methods, classes, and types must be imported |                                                                                                                                                                               |
| `forEach` is supported | `forEach` is not supported, but `for ... of` is supported | `for ... of` also enables continue/break                                                                                                                                      |

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

Decorators must be used to specify the action/OC if it differs from the default (NoOp/onCreate=disallow)

```ts
myPublicMethod() {

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

PuyaTS requires explicit usage of a constructor or type hint to return the result of a math operation. This is required so TypeScript (and thus your IDE and other tooling) knows the type of the result is not `number` (which is unavoidable TypeScript behavior).

```ts
getSum(x: uint64, y: uint64) {
    // Explicitly convert the result to a uint64
    const sum = Uint64(x + y);
    return sum;
}
```

or

```ts
getSum(x: uint64, y: uint64) {
    // Result is implicitly converted based on the assignment target type
    const sum: uint64 = x + y;
    return sum;
}
```

or

```ts
getSum(x: uint64, y: uint64): uint64 {
    // Result is implicitly converted based on the return value type
    return x + y;
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
const x = new UintN8(10);
const y = new UintN<64>(x);
```

### String vs Bytes

#### TEALScript

In TEALScript, bytes and strings are the same type and can be used interchangeably.

```ts
assert(swapAsset.assetName === "SWAP");
```

#### PuyaTS

In PuyaTS, bytes and strings are distinct types. Most functions accept `bytes | string`, but outputs will always be `bytes`

```ts
assert(swapAsset.assetName === Bytes("SWAP"));
// or
assert(swapAsset.assetName.toString() === "SWAP");
```

### Array Mutability

#### TEALScript

TEALScript supports mutable native TypeScript arrays

```ts
const myArray: uint64[] = [1, 2, 3];
myArray.push(4);
```

#### PuyaTS

In PuyaTS native arrays are always immutable.

```ts
let myArray: uint64[] = [1, 2, 3];
myArray = [...myArray, 4];
```

If you want mutability, there is an explicit `MutableArray` type:

```ts
let myArray = new MutableArray<uint64>(1, 2, 3);
myArray.push(4);
```

This type, however, can only be used internally. It cannot be put in storage, events, scratch, or used as a public ABI method parameter/return type.

### Object Mutability

#### TEALScript

In TEALScript, objects are mutable

```ts
type Favorites = {
    color: string,
    number: uint64,
}
```

```ts
updateFavoriteNumber(n: uint64) {
    this.favorites(this.txn.sender).value.number = n;
```

#### PuyaTS

Like Arrays, all objects are immutable.

```ts
type Favorites {
    color: string,
    number: uint64,
}
```

```ts
updateFavoriteNumber(n: uint64) {
    this.favorites.set(
        Txn.sender, 
        { ...this.listings.get(Txn.sender),  number: n }
    );
```

### ARC4 Types in State

#### TEALScript

In TEALScript, the same types used within method logic can be stored in state or used as state map keys.

```ts
export type ListingKey = {
    owner: Address,
    asset: Asset,
    nonce: uint64,
}
```

```ts
updateListing(xfer: AssetTransferTxn, nonce: uint64)
    const key: ListingKey = {
      owner: this.txn.sender,
      asset: xfer.xferAsset,
      nonce: nonce,
    })

    const listing = this.listings(key).value
```

#### PuyaTS

In PuyaTS, state can only hold ARC4 types.

```ts
export class ListingKey extends arc4.Struct<{
  owner: arc4.Address
  asset: arc4.UintN64
  nonce: arc4.UintN64
}> {}
```

```ts
updateListing(xfer: AssetTransferTransaction, nonce: arc4.UintN64) {
    const key = new ListingKey({
      owner: new arc4.Address(Txn.sender),
      asset: new arc4.UintN64(xfer.xferAsset.id),
      nonce: nonce,
    })

    const listing = this.listings.get(key).value.copy()
```

It should be noted that an `arc4.Struct` can only hold other ARC4 types. This is why we've used `arc4.UintN64` instead of `uint64` for the type of `none`. If `none` was a `uint64`, we would not be able to store it in the struct directly and would need to call `arc.UintN64(nonce)`

### State References

#### TEALScript

In TEALScript, one can get a reference to a state value and use it like a regular JavaScript object reference.

```ts
const listing = this.listings.get(key).value

listing.newPrice = newPrice; // The value is modified in state
```

#### PuyaTS

In PuyaTS, state references are not supported and data must be copied out and copied back in.

```ts
const listing = this.listings.get(key).value.copy()

listing.newPrice = newPrice; // The value is NOT modified in state
this.listings(key).value = listing; // We must manually set the value back in
```

Note that the same functionality for this example can be achieved by directly calling on `.value`

```ts
this.listings.get(key).value.price = newPrice; // Value is updated in state
```

### Non-Uint64 Math and Overflows

In TEALScript, the usage of non-64-bit numbers (`uint<N>`) are more or less the same as `uint64`. The intermediate values of these values can be anything (under 64 bits for N < 64, under 512 bits for N > 64). The values are only checked for overlow when they are encoded by storing them in state, logging them, returning them, etc.

```ts
doMath(): uint8 {
    const a: uint8 = 255;
    const b: uint8 = 255;
    const c = a + b; // Value exeeds max uint8 value, but we aren't encoding yet so no error occurs

    return c - 255; // The final value is below uint8 max value, so no error occurs
}
```

### PuyaTS

In PuyaTS, constructors must be used for every value and an overflow check is performed upon construction.

```ts
doMath(): UintN8 {
    const a = UintN8(255);
    const b: UintN8(255);
    const c = UintN8(a + b;) // Value exeeds max uint8 so an error is thrown
```

This means that having a constructor for every immediate value will result in a large program with a lot of opcode usage for overflow checks. This means in PuyaTS, you should use `uint64` or `biguint` until your value needs to be encodded.

```ts
doMath(): UintN8 {
    const a: uint64 = 255;
    const b: uint64 = 255;
    const c: uint64 = a + b;

    return UintN8(c - 255)
```

This will result in roughly the same behavior as TEALScript.
