import {
  abimethod,
  Contract,
  GlobalState,
} from "@algorandfoundation/algorand-typescript";
import type { uint64 } from "@algorandfoundation/algorand-typescript";
import { Uint256 } from "@algorandfoundation/algorand-typescript/arc4";

export default class Simple extends Contract {
  counter = GlobalState<uint64>({ key: "counter", initialValue: 0 });

  private incrementCounter(i: uint64): void {
    this.counter.value = this.counter.value + i;
  }

  @abimethod({ onCreate: "require" })
  createApplication(): void {}

  incr(i: uint64): void {
    this.incrementCounter(i);
  }

  decr(i: uint64): void {
    this.counter.value = this.counter.value - i;
  }

  add(a: Uint256, b: Uint256): Uint256 {
    return new Uint256(a.asBigUint() + b.asBigUint());
  }

  sub(a: Uint256, b: Uint256): Uint256 {
    return new Uint256(a.asBigUint() - b.asBigUint());
  }

  clearStateProgram(): boolean {
    this.incrementCounter(1);
    return true;
  }
}
