import { contract, Global } from "@algorandfoundation/algorand-typescript";
import { TestExecutionContext } from "@algorandfoundation/algorand-typescript-testing";
import {
  Address,
  methodSelector,
  Tuple,
} from "@algorandfoundation/algorand-typescript/arc4";
import { afterEach, describe, expect, test } from "vitest";
import { CreatorVerifier, OptInLsig } from "./lsig-with-app.algo";

describe("Lsig With App", () => {
  const ctx = new TestExecutionContext();

  afterEach(() => {
    ctx.reset();
  });

  describe("OptInLsig", () => {
    test("should verify that the transaction is an ASA opt-in", () => {
      const app = ctx.any.application();
      ctx.txn
        .createScope(
          [
            ctx.any.txn.assetTransfer({
              assetAmount: 0,
              assetReceiver: ctx.defaultSender,
              fee: 0,
              rekeyTo: Global.zeroAddress,
              assetCloseTo: Global.zeroAddress,
            }),
            ctx.any.txn.applicationCall({
              appId: app,
              appArgs: [methodSelector("verifyCreator(axfer)void")],
            }),
          ],
          0,
        )
        .execute(() => {
          ctx.setTemplateVar("APP_ID", app);
          const result = ctx.executeLogicSig(new OptInLsig());
          expect(result).toBe(true);
        });
    });
  });

  describe("CreatorVerifier", () => {
    test("should allow opt in", () => {
      const creatorVerifier = ctx.contract.create(CreatorVerifier);
      const creator = ctx.any.arc4.address();

      creatorVerifier.allowOptInsFrom(creator);

      const isAllowed = creatorVerifier.allowedCreators(
        new Tuple(new Address(ctx.defaultSender), creator),
      ).value;
      expect(isAllowed.native).toBe(true);
    });

    test("should disable opt in", () => {
      const creatorVerifier = ctx.contract.create(CreatorVerifier);
      const creator = ctx.any.arc4.address();

      creatorVerifier.disableOptInsFrom(creator);

      const isAllowed = creatorVerifier.allowedCreators(
        new Tuple(new Address(ctx.defaultSender), creator),
      ).value;
      expect(isAllowed.native).toBe(false);
    });

    test("should verify creator is opted in", () => {
      const creatorVerifier = ctx.contract.create(CreatorVerifier);

      const creator = ctx.any.account();
      const axfer = ctx.any.txn.assetTransfer({
        sender: ctx.defaultSender,
        xferAsset: ctx.any.asset({ creator }),
      });

      creatorVerifier.allowOptInsFrom(new Address(creator));

      expect(() => creatorVerifier.verifyCreator(axfer)).not.toThrow();
    });
  });
});
