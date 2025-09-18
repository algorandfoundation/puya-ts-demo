import { Bytes } from "@algorandfoundation/algorand-typescript";
import {
  ApplicationSpy,
  TestExecutionContext,
} from "@algorandfoundation/algorand-typescript-testing";
import { afterEach, describe, expect, test } from "@jest/globals";
import { FactoryCaller, NFTFactory } from "./itxns.algo";

describe("itxns", () => {
  const ctx = new TestExecutionContext();
  afterEach(() => {
    ctx.reset();
  });

  test("should be able to compile and call a precompiled app", () => {
    const asset = ctx.any.asset();
    const helloApp = ctx.any.application({
      approvalProgram: ctx.any.bytes(20),
    });
    ctx.setCompiledApp(NFTFactory, helloApp.id);

    const spy = new ApplicationSpy(NFTFactory);
    spy.on.createApplication(() => helloApp.id);
    spy.on.createNFT((itxnContext) => itxnContext.setReturnValue(asset.id));
    ctx.addApplicationSpy(spy);

    const factoryCaller = ctx.contract.create(FactoryCaller);

    const result = factoryCaller.mintAndGetAsset();

    expect(asset.id).toEqual(result);
  });
});
