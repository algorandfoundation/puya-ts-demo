import { describe, test, expect, afterEach } from "vitest";
import { Calculator } from "./calculator.algo";
import { TestExecutionContext } from "@algorandfoundation/algorand-typescript-testing";

describe("Calculator", () => {
  const ctx = new TestExecutionContext();

  afterEach(() => {
    ctx.reset();
  });

  test("should correctly add two numbers", () => {
    const calculator = ctx.contract.create(Calculator);
    const result = calculator.doMath(5, 3, "sum");
    expect(result).toEqual(8);
  });

  test("should correctly subtract two numbers", () => {
    const calculator = ctx.contract.create(Calculator);

    const result1 = calculator.doMath(5, 3, "difference");
    expect(result1).toEqual(2);

    const result2 = calculator.doMath(3, 5, "difference");
    expect(result2).toEqual(2);
  });

  test("should handle zero values correctly for sum", () => {
    const calculator = ctx.contract.create(Calculator);
    const result = calculator.doMath(0, 5, "sum");
    expect(result).toEqual(5);
  });

  test("should handle zero values correctly for difference", () => {
    const calculator = ctx.contract.create(Calculator);
    const result = calculator.doMath(5, 0, "difference");
    expect(result).toEqual(5);
  });

  test("should throw error for invalid operation", () => {
    const calculator = ctx.contract.create(Calculator);
    expect(() => calculator.doMath(5, 3, "invalid")).toThrow(
      "Invalid operation",
    );
  });
});
