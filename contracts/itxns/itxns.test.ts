import { Bytes } from "@algorandfoundation/algorand-typescript";
import { TestExecutionContext } from "@algorandfoundation/algorand-typescript-testing";
import { afterEach, describe, expect, test } from "@jest/globals";
import { FactoryCaller, NFTFactory } from "./itxns.algo";

const ABI_RETURN_VALUE_LOG_PREFIX = Bytes.fromHex("151F7C75");
describe("itxns", () => {
  const ctx = new TestExecutionContext();
  afterEach(() => {
    ctx.reset();
  });

  test("should be able to compile and call a precompiled app", () => {
    const asset = ctx.any.asset();
    const helloApp = ctx.any.application({
      approvalProgram: ctx.any.bytes(20),
      appLogs: [ABI_RETURN_VALUE_LOG_PREFIX.concat(Bytes(asset.id))],
    });
    ctx.setCompiledApp(NFTFactory, helloApp.id);

    const factoryCaller = ctx.contract.create(FactoryCaller);

    const result = factoryCaller.mintAndGetAsset();

    expect(asset.id).toEqual(result);
  });
});
