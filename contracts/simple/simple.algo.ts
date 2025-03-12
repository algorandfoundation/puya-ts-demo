import {
  abimethod,
  Contract,
  GlobalState,
} from "@algorandfoundation/algorand-typescript";
import type { uint64 } from "@algorandfoundation/algorand-typescript";
import { UintN256 } from "@algorandfoundation/algorand-typescript/arc4";

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

  add(a: UintN256, b: UintN256): UintN256 {
    return new UintN256(a.native + b.native);
  }

  sub(a: UintN256, b: UintN256): UintN256 {
    return new UintN256(a.native - b.native);
  }

  clearStateProgram(): boolean {
    this.incrementCounter(1);
    return true;
  }
}
