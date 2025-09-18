import { describe, expect, afterEach, test } from "vitest";
import { BigBox } from "./big-box.algo";
import { Bytes } from "@algorandfoundation/algorand-typescript";
import { TestExecutionContext } from "@algorandfoundation/algorand-typescript-testing";
import { Uint } from "@algorandfoundation/algorand-typescript/arc4";

describe("Big Box", () => {
  const ctx = new TestExecutionContext();

  afterEach(() => {
    ctx.reset();
  });

  describe("startUpload", () => {
    test("should create metadata for a new data upload", () => {
      // Arrange
      const dataIdentifier = "testData";
      const numBoxes = 2;
      const endBoxSize = 1024;
      const bigBox = ctx.contract.create(BigBox);
      const bigBoxApp = ctx.ledger.getApplicationForContract(bigBox);
      const paymentTxn = ctx.any.txn.payment({
        receiver: bigBoxApp.address,
        amount: 13573000,
      });

      // Act
      bigBox.startUpload(dataIdentifier, numBoxes, endBoxSize, paymentTxn);

      // Assert
      expect(bigBox.currentIndex.value).toBe(2); // startBox(0) + numBoxes(2)

      const metadata = bigBox.metadata(Bytes(dataIdentifier)).value;
      expect(metadata.start).toEqual(0);
      expect(metadata.end).toEqual(1);
      expect(metadata.status.asUint64()).toEqual(0);
      expect(metadata.endSize).toEqual(1024);
    });

    test("should fail if data identifier already exists", () => {
      // Arrange
      const dataIdentifier = "existingData";
      const bigBox = ctx.contract.create(BigBox);
      const bigBoxApp = ctx.ledger.getApplicationForContract(bigBox);
      const paymentTxn = ctx.any.txn.payment({
        receiver: bigBoxApp.address,
        amount: 2104200,
      });

      bigBox.metadata(Bytes(dataIdentifier)).value = {
        start: 0,
        end: 1,
        status: new Uint<8>(0),
        endSize: 1024,
      };

      // Act & Assert
      expect(() => {
        bigBox.startUpload(dataIdentifier, 1, 1024, paymentTxn);
      }).toThrow();
    });
  });
  describe("upload", () => {
    test("should upload data to a box with zero offset", () => {
      // Arrange
      const dataIdentifier = "testData";
      const boxIndex = 3;
      const offset = 0;
      const data = Bytes("testData");

      const bigBox = ctx.contract.create(BigBox);
      bigBox.metadata(Bytes(dataIdentifier)).value = {
        start: 0,
        end: 4,
        status: new Uint<8>(0),
        endSize: 1024,
      };

      // Act
      bigBox.upload(dataIdentifier, boxIndex, offset, data);

      // Assert
      expect(bigBox.dataBoxes(0).exists).toEqual(false);
      expect(bigBox.dataBoxes(boxIndex).extract(0, data.length)).toEqual(data);
    });

    test("should fail if data status is not IN_PROGRESS", () => {
      // Arrange
      const dataIdentifier = "testData";
      const bigBox = ctx.contract.create(BigBox);

      bigBox.metadata(Bytes(dataIdentifier)).value = {
        start: 0,
        end: 4,
        status: new Uint<8>(1),
        endSize: 1024,
      };

      // Act & Assert
      expect(() => {
        bigBox.upload(dataIdentifier, 0, 0, Bytes("test"));
      }).toThrow();
    });
  });

  describe("setStatus", () => {
    test("should update the status of the data", () => {
      // Arrange
      const dataIdentifier = "testData";
      const bigBox = ctx.contract.create(BigBox);
      bigBox.metadata(Bytes(dataIdentifier)).value = {
        start: 0,
        end: 4,
        status: new Uint<8>(0), // IN_PROGRESS
        endSize: 1024,
      };

      const newStatus = new Uint<8>(1); // READY

      // Act
      bigBox.setStatus(dataIdentifier, newStatus);

      // Assert
      expect(
        bigBox.metadata(Bytes(dataIdentifier)).value.status.asUint64(),
      ).toEqual(1);
    });

    test("should fail if trying to change IMMUTABLE status", () => {
      // Arrange
      const dataIdentifier = "testData";
      const bigBox = ctx.contract.create(BigBox);
      bigBox.metadata(Bytes(dataIdentifier)).value = {
        start: 0,
        end: 4,
        status: new Uint<8>(2), // IMMUTABLE
        endSize: 1024,
      };

      const newStatus = new Uint<8>(1); // READY

      // Act & Assert
      expect(() => {
        bigBox.setStatus(dataIdentifier, newStatus);
      }).toThrow();
    });
  });
});
