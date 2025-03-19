import { describe, expect, test, afterEach } from "@jest/globals";
import { MerkleTree } from "./merkle.algo";
import { TestExecutionContext } from "@algorandfoundation/algorand-typescript-testing";
import {
  Bytes,
  FixedArray,
  OnCompleteAction,
} from "@algorandfoundation/algorand-typescript";
import type { bytes } from "@algorandfoundation/algorand-typescript";

describe("MerkleTree", () => {
  const ctx = new TestExecutionContext();

  afterEach(() => {
    ctx.reset();
  });

  describe("createApplication", () => {
    test("should initialize with empty root hash", () => {
      // Arrange & Act
      const merkle = ctx.contract.create(MerkleTree);
      merkle.createApplication();
      const expectedRoot = Bytes.fromHex(
        "80d1bf4dd6c1f75bba022337a3f0842078f5c2e7f3f59dfd33ccbb8e963367b2",
      );

      // Assert
      expect(merkle.size.value).toEqual(0);
      // Initial root should be hash of empty hashes based on tree depth
      expect(merkle.root.value).toEqual(expectedRoot);
    });
  });

  describe("appendLeaf", () => {
    test("should append new leaf with valid proof path", () => {
      // Arrange
      const merkle = ctx.contract.create(MerkleTree);
      merkle.createApplication();
      const data = Bytes("test data");

      // Create a valid proof path for an empty leaf
      const path = new FixedArray<bytes<33>, 3>(
        Bytes.fromHex<33>(
          "aae3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        ),
        Bytes.fromHex<33>(
          "aa2dba5dbc339e7316aea2683faf839c1b7b1ee2313db792112588118df066aa35",
        ),
        Bytes.fromHex<33>(
          "aa5310a330e8f970388503c73349d80b45cd764db615f1bced2801dcd4524a2ff4",
        ),
      );

      // Act
      merkle.appendLeaf(data, path);

      // Assert
      expect(merkle.size.value).toBe(1);
    });

    test("should reject empty data", () => {
      // Arrange
      const merkle = ctx.contract.create(MerkleTree);
      merkle.createApplication();

      const emptyData = Bytes("");
      const path = new FixedArray<bytes<33>, 3>(
        Bytes.fromHex<33>(
          "aae3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        ),
        Bytes.fromHex<33>(
          "aa2dba5dbc339e7316aea2683faf839c1b7b1ee2313db792112588118df066aa35",
        ),
        Bytes.fromHex<33>(
          "aa5310a330e8f970388503c73349d80b45cd764db615f1bced2801dcd4524a2ff4",
        ),
      );

      // Act & Assert
      expect(() => merkle.appendLeaf(emptyData, path)).toThrow();
    });
  });

  describe("verify", () => {
    test("should verify existing leaf", () => {
      // Arrange
      const merkle = ctx.contract.create(MerkleTree);
      merkle.createApplication();

      const data = Bytes("test data");
      const path = new FixedArray<bytes<33>, 3>(
        Bytes.fromHex<33>(
          "aae3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        ),
        Bytes.fromHex<33>(
          "aa2dba5dbc339e7316aea2683faf839c1b7b1ee2313db792112588118df066aa35",
        ),
        Bytes.fromHex<33>(
          "aa5310a330e8f970388503c73349d80b45cd764db615f1bced2801dcd4524a2ff4",
        ),
      );

      // Add leaf first
      merkle.appendLeaf(data, path);

      // Act & Assert
      expect(() => merkle.verify(data, path)).not.toThrow();
    });

    test("should fail for invalid proof path", () => {
      // Arrange
      const merkle = ctx.contract.create(MerkleTree);
      merkle.createApplication();

      const data = Bytes("test data");
      // Create an invalid proof path
      const invalidPath = new FixedArray<bytes<33>, 3>(
        Bytes<33>(new Uint8Array(33).fill(1)),
        Bytes<33>(new Uint8Array(33).fill(1)),
        Bytes<33>(new Uint8Array(33).fill(1)),
      );

      // Act & Assert
      expect(() => merkle.verify(data, invalidPath)).toThrow();
    });
  });

  describe("updateLeaf", () => {
    test("should update existing leaf with valid proof", () => {
      // Arrange
      const merkle = ctx.contract.create(MerkleTree);
      merkle.createApplication();

      const oldData = Bytes("old data");
      const newData = Bytes("new data");
      const path = new FixedArray<bytes<33>, 3>(
        Bytes.fromHex<33>(
          "aae3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        ),
        Bytes.fromHex<33>(
          "aa2dba5dbc339e7316aea2683faf839c1b7b1ee2313db792112588118df066aa35",
        ),
        Bytes.fromHex<33>(
          "aa5310a330e8f970388503c73349d80b45cd764db615f1bced2801dcd4524a2ff4",
        ),
      );

      // Add initial leaf
      merkle.appendLeaf(oldData, path);
      const oldRoot = merkle.root.value;

      // Act
      merkle.updateLeaf(oldData, newData, path);

      // Assert
      expect(merkle.root.value).not.toEqual(oldRoot);
    });

    test("should reject empty new data", () => {
      // Arrange
      const merkle = ctx.contract.create(MerkleTree);
      merkle.createApplication();

      const oldData = Bytes("old data");
      const emptyData = Bytes("");
      const path = new FixedArray<bytes<33>, 3>(
        Bytes.fromHex<33>(
          "aae3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        ),
        Bytes.fromHex<33>(
          "aa2dba5dbc339e7316aea2683faf839c1b7b1ee2313db792112588118df066aa35",
        ),
        Bytes.fromHex<33>(
          "aa5310a330e8f970388503c73349d80b45cd764db615f1bced2801dcd4524a2ff4",
        ),
      );

      // Add initial leaf
      merkle.appendLeaf(oldData, path);

      // Act & Assert
      expect(() => merkle.updateLeaf(oldData, emptyData, path)).toThrow();
    });

    test("should reject update with invalid old data proof", () => {
      // Arrange
      const merkle = ctx.contract.create(MerkleTree);
      merkle.createApplication();

      const oldData = Bytes("old data");
      const wrongOldData = Bytes("wrong old data");
      const newData = Bytes("new data");

      const path = new FixedArray<bytes<33>, 3>(
        Bytes.fromHex<33>(
          "aae3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        ),
        Bytes.fromHex<33>(
          "aa2dba5dbc339e7316aea2683faf839c1b7b1ee2313db792112588118df066aa35",
        ),
        Bytes.fromHex<33>(
          "aa5310a330e8f970388503c73349d80b45cd764db615f1bced2801dcd4524a2ff4",
        ),
      );

      // Add initial leaf
      merkle.appendLeaf(oldData, path);

      // Act & Assert
      expect(() => merkle.updateLeaf(wrongOldData, newData, path)).toThrow();
    });
  });

  describe("deleteApplication", () => {
    test("should allow creator to delete application", () => {
      // Arrange
      const merkle = ctx.contract.create(MerkleTree);
      merkle.createApplication();

      // Set transaction sender as creator
      ctx.txn
        .createScope([
          ctx.any.txn.applicationCall({
            sender: ctx.ledger.getApplicationForContract(merkle).creator,
            onCompletion: OnCompleteAction.DeleteApplication,
          }),
        ])
        .execute(() => {
          // Act & Assert
          expect(() => merkle.deleteApplication()).not.toThrow();
        });
    });

    test("should reject deletion from non-creator", () => {
      // Arrange
      const merkle = ctx.contract.create(MerkleTree);
      merkle.createApplication();

      // Set transaction sender as non-creator
      ctx.txn
        .createScope([
          ctx.any.txn.applicationCall({
            sender: ctx.any.account(),
            onCompletion: OnCompleteAction.DeleteApplication,
          }),
        ])
        .execute(() => {
          // Act & Assert
          expect(() => merkle.deleteApplication()).toThrow();
        });
    });
  });
});
