import { Contract } from "@algorandfoundation/tealscript";

export class KitchenSinkContract extends Contract {
  globalInt = GlobalStateKey<uint64>();
  globalString = GlobalStateKey<string>();

  localBigInt = LocalStateKey<uint<512>>();

  boxOfArray = BoxKey<uint64[]>({ key: "b" });
  boxMap = BoxMap<Address, uint64>({ prefix: "" });
  boxRef = BoxKey<bytes>({ key: "ff" });

  useState(a: uint64, b: string, c: uint64) {
    this.globalInt.value *= a;
    if (this.globalString.exists) {
      this.globalString.value += b;
    } else {
      this.globalString.value = b;
    }
    if (this.txn.sender.isOptedInToApp(this.app.id)) {
      this.localBigInt(this.txn.sender).value = <uint<512>>(c * a);
    }
  }

  createApp() {
    this.globalInt.value = 4;
    this.globalInt.value = this.app.id;
  }

  optInToApplication() {}

  addToBox(x: uint64) {
    if (!this.boxOfArray.exists) {
      this.boxOfArray.value = [];
    } else {
      this.boxOfArray.value.push(x);
    }
  }

  addToBoxMap(x: uint64) {
    this.boxMap(this.txn.sender).value = x;
  }

  insertIntoBoxRef(content: bytes, offset: uint64, boxSize: uint64) {
    assert(offset + content.length < boxSize);
    if (this.boxRef.exists) {
      this.boxRef.create(boxSize);
    } else if (this.boxRef.size !== boxSize) {
      this.boxRef.resize(boxSize);
    }
    this.boxRef.splice(offset, offset + content.length, content);
  }

  sayHello(name: string, a: uint64): string {
    return this.getHello() + name + itob(a);
  }

  checkTransaction(pay: PayTxn) {
    verifyPayTxn(pay, {
      amount: { greaterThan: 1000, lessThan: 2000 },
      lastValid: { greaterThan: globals.round },
      sender: this.txn.sender,
      receiver: this.app.address,
    });
  }

  private getHello(): string {
    return "Hello";
  }
}
