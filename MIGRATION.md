## Nominal Changes

These are changes to the way things are named, but the functionality remains the same.

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

These are minor changes to the syntax of the language/API.

| TEALScript                                 | PuyaTS                                   | Notes                                                                                            |
| ------------------------------------------ | ---------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `this.boxRef.create(boxSize)`              | `this.boxRef.create({ size: boxSize })`  | The size option is now a property of the create method                                           |
| Explcicit method return types are required | Implicit method return types are allowed |                                                                                                  |
| `verify...Txn`                             | `assertMatch`                            | `assertMatch` accepts any object. This means, however, that txn types must be explicitly checked |

## Major Changes

These are major changes to the syntax of the language/API.

### Method Routing

#### TEALScript

Each action (OnCompletes and create) has a method name that is used to route to the correct method when that action/OC is performed.

```ts
createApplication() {
```

#### PuyaTS

Decorators must be used to specify the action/OC.

```ts
@abimethod({ onCreate: "require", allowActions: "NoOp" })
createApplication() {
```

### Native vs ABI types

#### TEALScript

TEALScript does ABI encoding/decoding automatically where appropriate.

```ts
addToBox(x: uint64) {
    if (!this.boxOfArray.exists) {
        this.boxOfArray.value = [x];
    } else {
        this.boxOfArray.value.push(x);
    }
}
```

#### PuyaTS

Puya requires explicit ABI encoding/decoding in some scenarios, resulting in a "native" `uint64` type and a `UintN<64>` type. This also means that arrays must be initialized with a constructor rather than using array literals.

```ts
addToBox(x: uint64) {
    if (!this.boxOfArray.exists) {
        this.boxOfArray.value = new DynamicArray(new UintN<64>(x));
    } else {
        this.boxOfArray.value.push(new UintN<64>(x));
    }
}
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
    const sum = UintN<64>(sum);
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
