import { TestExecutionContext } from "@algorandfoundation/algorand-typescript-testing";
import { describe, expect, it } from "vitest";
import { HelloWorldContract } from "./hello-world.algo";

describe("HelloWorldContract", () => {
  const ctx = new TestExecutionContext();
  it("Logs the returned value when sayHello is called", () => {
    const contract = ctx.contract.create(HelloWorldContract);

    const result = contract.sayHello("Sally");

    expect(result).toBe("Hello Sally");
  });
});
