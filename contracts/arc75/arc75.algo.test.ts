import { describe, expect, test, afterEach } from "@jest/globals";
import { ARC75 } from "./arc75.algo";
import { TestExecutionContext } from "@algorandfoundation/algorand-typescript-testing";
import {
  Address,
  Str,
  Uint16,
} from "@algorandfoundation/algorand-typescript/arc4";

describe("ARC75", () => {
  const ctx = new TestExecutionContext();

  afterEach(() => {
    ctx.reset();
  });

  describe("addAppToWhiteList", () => {
    test("should add app to a new whitelist", () => {
      // Arrange
      const arc75 = ctx.contract.create(ARC75);
      const arc75App = ctx.ledger.getApplicationForContract(arc75);

      const arcName = "arc20";
      const boxIndex = new Uint16(1);
      const appId = 123;

      // Create a payment transaction for MBR
      const paymentTxn = ctx.any.txn.payment({
        sender: ctx.defaultSender,
        receiver: arc75App.address,
        amount: 0,
      });

      // Act
      arc75.addAppToWhiteList(arcName, boxIndex, appId, paymentTxn);

      // Assert
      const whitelistKey = {
        account: new Address(ctx.defaultSender),
        boxIndex: boxIndex,
        arc: arcName,
      };

      expect(arc75.whitelist(whitelistKey).exists).toEqual(true);
      expect(arc75.whitelist(whitelistKey).value.length).toEqual(1);
      expect(arc75.whitelist(whitelistKey).value[0]).toEqual(appId);
    });

    test("should add app to an existing whitelist", () => {
      // Arrange
      const arc75 = ctx.contract.create(ARC75);
      const arc75App = ctx.ledger.getApplicationForContract(arc75);

      const arcName = "arc20";
      const boxIndex = new Uint16(1);
      const firstApp = ctx.any.application();
      const secondApp = ctx.any.application();

      // Add first app
      const firstPaymentTxn = ctx.any.txn.payment({
        sender: ctx.defaultSender,
        receiver: arc75App.address,
        amount: 0,
      });
      arc75.addAppToWhiteList(arcName, boxIndex, firstApp.id, firstPaymentTxn);

      // Create a payment transaction for second app
      const secondPaymentTxn = ctx.any.txn.payment({
        sender: ctx.defaultSender,
        receiver: arc75App.address,
        amount: 0, // Lower amount since box already exists
      });

      // Act
      arc75.addAppToWhiteList(
        arcName,
        boxIndex,
        secondApp.id,
        secondPaymentTxn,
      );

      // Assert
      const whitelistKey = {
        account: new Address(ctx.defaultSender),
        boxIndex: boxIndex,
        arc: arcName,
      };

      expect(arc75.whitelist(whitelistKey).value.length).toEqual(2);
      expect(arc75.whitelist(whitelistKey).value[0]).toEqual(firstApp.id);
      expect(arc75.whitelist(whitelistKey).value[1]).toEqual(secondApp.id);
    });
  });

  describe("setAppWhitelist", () => {
    test("should set a new whitelist with multiple apps", () => {
      // Arrange
      const arc75 = ctx.contract.create(ARC75);
      const arc75App = ctx.ledger.getApplicationForContract(arc75);

      const arcName = "arc20";
      const boxIndex = new Uint16(1);
      const appIds = [123, 456, 789];

      // Create a payment transaction
      const paymentTxn = ctx.any.txn.payment({
        sender: ctx.defaultSender,
        receiver: arc75App.address,
        amount: 0,
      });

      // Act
      ctx.txn
        .createScope(
          [paymentTxn, ctx.any.txn.applicationCall({ appId: arc75 })],
          1,
        )
        .execute(() => {
          arc75.setAppWhitelist(arcName, boxIndex, appIds);
        });
      // Assert
      const whitelistKey = {
        account: new Address(ctx.defaultSender),
        boxIndex: boxIndex,
        arc: arcName,
      };

      expect(arc75.whitelist(whitelistKey).exists).toEqual(true);
      expect(arc75.whitelist(whitelistKey).value.length).toEqual(appIds.length);

      for (let i = 0; i < appIds.length; i++) {
        expect(arc75.whitelist(whitelistKey).value[i]).toEqual(appIds[i]);
      }
    });

    test("should replace an existing whitelist", () => {
      // Arrange
      const arc75 = ctx.contract.create(ARC75);
      const arc75App = ctx.ledger.getApplicationForContract(arc75);
      const arcName = "arc20";
      const boxIndex = new Uint16(1);

      const initialAppIds = [123, 456];
      const newAppIds = [789, 101112];

      const paymentTxn = ctx.any.txn.payment({
        sender: ctx.defaultSender,
        receiver: arc75App.address,
        amount: 0,
      });

      ctx.txn
        .createScope(
          [paymentTxn, ctx.any.txn.applicationCall({ appId: arc75 })],
          1,
        )
        .execute(() => {
          arc75.setAppWhitelist(arcName, boxIndex, initialAppIds);
        });
      const whitelistKey = {
        account: new Address(ctx.defaultSender),
        boxIndex: boxIndex,
        arc: arcName,
      };

      expect(arc75.whitelist(whitelistKey).value.length).toEqual(
        initialAppIds.length,
      );

      for (let i = 0; i < newAppIds.length; i++) {
        expect(arc75.whitelist(whitelistKey).value[i]).toEqual(
          initialAppIds[i],
        );
      }

      // Act
      ctx.txn
        .createScope(
          [paymentTxn, ctx.any.txn.applicationCall({ appId: arc75 })],
          1,
        )
        .execute(() => {
          arc75.setAppWhitelist(arcName, boxIndex, newAppIds);
        });

      // Assert

      expect(arc75.whitelist(whitelistKey).value.length).toEqual(
        newAppIds.length,
      );

      for (let i = 0; i < newAppIds.length; i++) {
        expect(arc75.whitelist(whitelistKey).value[i]).toEqual(newAppIds[i]);
      }
    });
  });

  describe("deleteWhitelist", () => {
    test("should delete an entire whitelist", () => {
      // Arrange
      const arc75 = ctx.contract.create(ARC75);
      const arc75App = ctx.ledger.getApplicationForContract(arc75);
      const arcName = "arc20";
      const boxIndex = new Uint16(1);
      const appIds = [123, 456];

      const paymentTxn = ctx.any.txn.payment({
        sender: ctx.defaultSender,
        receiver: arc75App.address,
        amount: 0,
      });

      ctx.txn
        .createScope(
          [paymentTxn, ctx.any.txn.applicationCall({ appId: arc75 })],
          1,
        )
        .execute(() => {
          arc75.setAppWhitelist(arcName, boxIndex, appIds);
        });

      // Act
      arc75.deleteWhitelist(arcName, boxIndex);

      // Assert
      const whitelistKey = {
        account: new Address(ctx.defaultSender),
        boxIndex: boxIndex,
        arc: arcName,
      };

      expect(arc75.whitelist(whitelistKey).exists).toEqual(false);
    });
  });

  describe("deleteAppFromWhitelist", () => {
    test("should delete a specific app from whitelist", () => {
      // Arrange
      const arc75 = ctx.contract.create(ARC75);
      const arc75App = ctx.ledger.getApplicationForContract(arc75);

      const arcName = "arc20";
      const boxIndex = new Uint16(1);
      const appIds = [123, 456, 789];
      const appToDeleteId = 456;
      const appToDeleteIndex = 1;

      const paymentTxn = ctx.any.txn.payment({
        sender: ctx.defaultSender,
        receiver: arc75App.address,
        amount: 0,
      });

      ctx.txn
        .createScope(
          [paymentTxn, ctx.any.txn.applicationCall({ appId: arc75 })],
          1,
        )
        .execute(() => {
          arc75.setAppWhitelist(arcName, boxIndex, appIds);
        });

      // Act
      arc75.deleteAppFromWhitelist(
        arcName,
        boxIndex,
        appToDeleteId,
        appToDeleteIndex,
      );

      // Assert
      const whitelistKey = {
        account: new Address(ctx.defaultSender),
        boxIndex: boxIndex,
        arc: arcName,
      };

      expect(arc75.whitelist(whitelistKey).exists).toEqual(true);
      expect(arc75.whitelist(whitelistKey).value.length).toEqual(2);
      expect(arc75.whitelist(whitelistKey).value[0]).toEqual(123);
      expect(arc75.whitelist(whitelistKey).value[1]).toEqual(789);
    });

    test("should throw when app ID at index doesn't match", () => {
      // Arrange
      const arc75 = ctx.contract.create(ARC75);
      const arc75App = ctx.ledger.getApplicationForContract(arc75);

      const arcName = "arc20";
      const boxIndex = new Uint16(1);
      const appIds = [123, 456, 789];
      const incorrectAppId = 999;
      const appToDeleteIndex = 1;

      const paymentTxn = ctx.any.txn.payment({
        sender: ctx.defaultSender,
        receiver: arc75App.address,
        amount: 0,
      });

      ctx.txn
        .createScope(
          [paymentTxn, ctx.any.txn.applicationCall({ appId: arc75 })],
          1,
        )
        .execute(() => {
          arc75.setAppWhitelist(arcName, boxIndex, appIds);
        });

      // Act & Assert
      expect(() => {
        arc75.deleteAppFromWhitelist(
          arcName,
          boxIndex,
          incorrectAppId,
          appToDeleteIndex,
        );
      }).toThrow();
    });
  });
});
