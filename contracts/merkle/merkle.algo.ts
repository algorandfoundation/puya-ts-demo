import {
  assert,
  assertMatch,
  Bytes,
  Contract,
  GlobalState,
} from "@algorandfoundation/algorand-typescript";
import { abimethod } from "@algorandfoundation/algorand-typescript/arc4";
import type {
  bytes,
  FixedArray,
  uint64,
} from "@algorandfoundation/algorand-typescript";
import {
  extract,
  getByte,
  Global,
  sha256,
  Txn,
} from "@algorandfoundation/algorand-typescript/op";

const TREE_DEPTH: uint64 = 3;
const EMPTY_HASH =
  "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
const RIGHT_SIBLING_PREFIX: uint64 = 170;

type Branch = bytes<33>;
type Path = FixedArray<Branch, 3>;

export class MerkleTree extends Contract {
  root = GlobalState<bytes<32>>();

  size = GlobalState<uint64>({ initialValue: 0 });

  private calcInitRoot(): bytes<32> {
    let result = Bytes.fromHex<32>(EMPTY_HASH);

    for (let i: uint64 = 0; i < TREE_DEPTH; i = i + 1) {
      result = sha256(result.concat(result));
    }

    return result;
  }

  private hashConcat(left: bytes<32>, right: bytes<32>): bytes<32> {
    return sha256(left.concat(right));
  }

  private isRightSibling(elem: Branch): boolean {
    return getByte(elem, 0) === RIGHT_SIBLING_PREFIX;
  }

  private calcRoot(leaf: bytes<32>, path: Path): bytes<32> {
    let result = leaf;

    for (let i: uint64 = 0; i < TREE_DEPTH; i = i + 1) {
      const elem = path[i];

      if (this.isRightSibling(elem)) {
        result = this.hashConcat(
          result,
          extract(elem, 1, 32).toFixed({ length: 32 }),
        );
      } else {
        result = this.hashConcat(
          extract(elem, 1, 32).toFixed({ length: 32 }),
          result,
        );
      }
    }

    return result;
  }

  @abimethod({ allowActions: "DeleteApplication" })
  deleteApplication(): void {
    assertMatch(Txn, { sender: Global.currentApplicationId.creator });
  }

  @abimethod({ onCreate: "require" })
  createApplication(): void {
    this.root.value = this.calcInitRoot();
  }

  verify(data: bytes, path: Path): void {
    assert(this.root.value === this.calcRoot(sha256(data), path));
  }

  appendLeaf(data: bytes, path: Path): void {
    assert(data !== Bytes());
    assert(
      this.root.value === this.calcRoot(Bytes.fromHex<32>(EMPTY_HASH), path),
    );

    this.root.value = this.calcRoot(sha256(data), path);

    this.size.value = this.size.value + 1;
  }

  updateLeaf(oldData: bytes, newData: bytes, path: Path): void {
    assert(newData !== Bytes());
    assert(this.root.value === this.calcRoot(sha256(oldData), path));

    this.root.value = this.calcRoot(sha256(newData), path);
  }
}
