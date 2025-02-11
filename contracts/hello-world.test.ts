import { TestExecutionContext } from "@algorandfoundation/algorand-typescript-testing";
import { HelloWorldContract } from "./hello-world.algo";

describe('HelloWorldContract', () => {
  const ctx = new TestExecutionContext();

  test('Logs the returned value when sayHello is called', () => {
      const contract = ctx.contract.create(HelloWorldContract);

      const result = contract.sayHello("Sally");

      expect(result).toBe("Hello Sally");
  });
});