import { TestExecutionContext } from "@algorandfoundation/algorand-typescript-testing";
import { afterEach, describe, expect, test } from "@jest/globals";
import Simple from "./simple.algo";
import { UintN256 } from "@algorandfoundation/algorand-typescript/arc4";

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

    const addResult = simple.add(new UintN256(123), new UintN256(456));

    expect(addResult.native).toEqual(123 + 456);
  });

  test("should correctly subtract two biguints", () => {
    const simple = ctx.contract.create(Simple);

    const subResult = simple.sub(new UintN256(5), new UintN256(3));

    expect(subResult.native).toEqual(5 - 3);
  });
});
