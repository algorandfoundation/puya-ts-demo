import {
  assert,
  assertMatch,
  Bytes,
  Contract,
  GlobalState,
  log,
} from "@algorandfoundation/algorand-typescript";
import {
  abimethod,
  StaticArray,
  StaticBytes,
  UintN64,
} from "@algorandfoundation/algorand-typescript/arc4";
import type { bytes, uint64 } from "@algorandfoundation/algorand-typescript";
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

type Branch = StaticBytes<33>;
type Path = StaticArray<Branch, 3>;

export class MerkleTree extends Contract {
  root = GlobalState<StaticBytes<32>>();

  size = GlobalState<uint64>({ initialValue: 0 });

  private calcInitRoot(): StaticBytes<32> {
    let result = Bytes.fromHex(EMPTY_HASH);

    for (let i: uint64 = 0; i < TREE_DEPTH; i = i + 1) {
      result = sha256(result.concat(result));
    }

    return new StaticBytes<32>(result);
  }

  private hashConcat(
    left: StaticBytes<32>,
    right: StaticBytes<32>,
  ): StaticBytes<32> {
    return new StaticBytes<32>(sha256(left.native.concat(right.native)));
  }

  private isRightSibling(elem: Branch): boolean {
    return getByte(elem.native, 0) === RIGHT_SIBLING_PREFIX;
  }

  private calcRoot(leaf: StaticBytes<32>, path: Path): StaticBytes<32> {
    let result = leaf;

    for (let i: uint64 = 0; i < TREE_DEPTH; i = i + 1) {
      const elem = path[i];

      if (this.isRightSibling(elem)) {
        result = this.hashConcat(
          result,
          new StaticBytes<32>(extract(elem.native, 1, 32)),
        );
      } else {
        result = this.hashConcat(
          new StaticBytes<32>(extract(elem.native, 1, 32)),
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
    assert(
      this.root.value ===
        this.calcRoot(new StaticBytes<32>(sha256(data)), path),
    );
  }

  appendLeaf(data: bytes, path: Path): void {
    assert(data !== Bytes());
    assert(
      this.root.value ===
        this.calcRoot(new StaticBytes<32>(Bytes.fromHex(EMPTY_HASH)), path),
    );

    this.root.value = this.calcRoot(new StaticBytes<32>(sha256(data)), path);

    this.size.value = this.size.value + 1;
  }

  updateLeaf(oldData: bytes, newData: bytes, path: Path): void {
    assert(newData !== Bytes());
    assert(
      this.root.value ===
        this.calcRoot(new StaticBytes<32>(sha256(oldData)), path),
    );

    this.root.value = this.calcRoot(new StaticBytes<32>(sha256(newData)), path);
  }
}
