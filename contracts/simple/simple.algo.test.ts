import { TestExecutionContext } from "@algorandfoundation/algorand-typescript-testing";
import { afterEach, describe, expect, test } from "@jest/globals";
import Simple from "./simple.algo";
import { Uint256 } from "@algorandfoundation/algorand-typescript/arc4";

describe("Simple", () => {
  const ctx = new TestExecutionContext();

  afterEach(() => {
    ctx.reset();
  });

  test("should increment counter", () => {
    const simple = ctx.contract.create(Simple);

    simple.incr(1);
    simple.incr(1);
    simple.incr(1);

    expect(simple.counter.value).toEqual(3);
  });

  test("should correctly add two biguints", () => {
    const simple = ctx.contract.create(Simple);

    const addResult = simple.add(new Uint256(123), new Uint256(456));

    expect(addResult.asBigUint()).toEqual(123 + 456);
  });

  test("should correctly subtract two biguints", () => {
    const simple = ctx.contract.create(Simple);

    const subResult = simple.sub(new Uint256(5), new Uint256(3));

    expect(subResult.asBigUint()).toEqual(5 - 3);
  });
});
