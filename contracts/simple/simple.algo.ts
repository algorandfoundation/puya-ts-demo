import { arc4, GlobalState } from '@algorandfoundation/algorand-typescript'
import type { biguint, uint64 } from '@algorandfoundation/algorand-typescript'


export default class Simple extends arc4.Contract {
  counter = GlobalState<uint64>({ key: 'counter', initialValue: 0 })

  private incrementCounter(i: uint64): void {
    this.counter.value = this.counter.value + i
  }

  incr(i: uint64): void {
    this.incrementCounter(i)
  }

  decr(i: uint64): void {
    this.counter.value = this.counter.value - i
  }

  add(a: biguint, b: biguint): biguint {
    return a + b
  }

  sub(a: biguint, b: biguint): biguint {
    return a - b
  }

  clearState(): void {
    this.incrementCounter(1)
  }
}
