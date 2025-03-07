import {
  abimethod,
  Account,
  Application,
  assert,
  assertMatch,
  BigUint,
  biguint,
  Box,
  BoxMap,
  BoxRef,
  bytes,
  Bytes,
  Contract,
  Global,
  GlobalState,
  gtxn,
  LocalState,
  Txn,
  Uint64,
  uint64,
} from "@algorandfoundation/algorand-typescript";
import {
  DynamicArray,
  UintN,
} from "@algorandfoundation/algorand-typescript/arc4";

export class KitchenSinkContract extends Contract {
  globalInt = GlobalState({ initialValue: Uint64(4) });
  globalString = GlobalState<string>({ key: "customKey" });

  localBigInt = LocalState<biguint>();

  boxOfArray = Box<DynamicArray<UintN<64>>>({ key: "b" });
  boxMap = BoxMap<Account, bytes>({ keyPrefix: "" });
  boxRef = BoxRef({ key: Bytes.fromHex("FF") });

  useState(a: uint64, b: string, c: uint64) {
    this.globalInt.value *= a;
    if (this.globalString.hasValue) {
      this.globalString.value += b;
    } else {
      this.globalString.value = b;
    }
    if (Txn.sender.isOptedIn(Global.currentApplicationId)) {
      this.localBigInt(Txn.sender).value = BigUint(c) * BigUint(a);
    }
  }

  @abimethod({ onCreate: "require", allowActions: "NoOp" })
  createApp() {
    this.globalInt.value = Global.currentApplicationId.id;
  }

  @abimethod({ allowActions: ["OptIn"] })
  optIn() {}

  addToBox(x: uint64) {
    if (!this.boxOfArray.exists) {
      this.boxOfArray.value = new DynamicArray(new UintN<64>(x));
    } else {
      this.boxOfArray.value.push(new UintN<64>(x));
    }
  }

  addToBoxMap(x: string) {
    this.boxMap(Txn.sender).value = Bytes(x);
  }

  insertIntoBoxRef(content: bytes, offset: uint64, boxSize: uint64) {
    assert(offset + content.length < boxSize);
    if (this.boxRef.exists) {
      this.boxRef.create({ size: boxSize });
    } else if (this.boxRef.length !== boxSize) {
      this.boxRef.resize(boxSize);
    }
    this.boxRef.splice(offset, offset + content.length, content);
  }

  sayHello(name: string, a: uint64): string {
    return `${this.getHello()} ${name} ${Bytes(a)}`;
  }

  checkTransaction(pay: gtxn.PaymentTxn) {
    assertMatch(pay, {
      amount: { between: [1000, 2000] },
      lastValid: { greaterThan: Global.round },
      sender: Txn.sender,
      receiver: Global.currentApplicationId.address,
    });
  }

  private getHello() {
    return "Hello";
  }
}
