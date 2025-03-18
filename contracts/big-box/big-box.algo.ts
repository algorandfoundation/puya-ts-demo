import {
  assert,
  assertMatch,
  BoxMap,
  Bytes,
  Contract,
  Global,
  GlobalState,
} from "@algorandfoundation/algorand-typescript";
import type {
  bytes,
  gtxn,
  uint64,
} from "@algorandfoundation/algorand-typescript";
import {
  abimethod,
  Struct,
  UintN,
  UintN64,
} from "@algorandfoundation/algorand-typescript/arc4";

/*
start - The index of the box at which the data starts
end - The index of the box at which the data ends
status - 0: in progress, 1: ready, 2: immutable
endSize - The size of the last box
*/
export class Metadata extends Struct<{
  start: UintN64;
  end: UintN64;
  status: UintN<8>;
  endSize: UintN64;
}> {}

const IN_PROGRESS = new UintN<8>(0);
const READY = new UintN<8>(1);
const IMMUTABLE = new UintN<8>(2);

const COST_PER_BYTE: uint64 = 400;
const COST_PER_BOX: uint64 = 2500;

// reduced to max bytes length (4096) as BoxMap in puya-ts does not support storing values exceeding max bytes length.
const MAX_BOX_SIZE: uint64 = 4096;

export class BigBox extends Contract {
  // The boxes that contain the data, indexed by uint64
  dataBoxes = BoxMap<uint64, bytes>({ keyPrefix: Bytes() });

  // Metadata for a given data identifier
  // The data identifier can be any string up to 64 bytes
  metadata = BoxMap<bytes, Metadata>({ keyPrefix: Bytes() });

  // The index of the next box to be created
  currentIndex = GlobalState<uint64>({ initialValue: 0 });

  @abimethod({ onCreate: "require" })
  createApplication(): void {}

  /**
   *
   * Allocate boxes to begin data upload process
   *
   * @param dataIdentifier The unique identifier for the data
   * @param numBoxes The number of boxes that the data will take up
   * @param endBoxSize The size of the last box
   * @param mbrPayment Payment from the uploader to cover the box MBR
   */
  startUpload(
    dataIdentifier: string,
    numBoxes: uint64,
    endBoxSize: uint64,
    mbrPayment: gtxn.PaymentTxn,
  ): void {
    const startBox = this.currentIndex.value;
    const endBox: uint64 = startBox + numBoxes - 1;

    const metadata = new Metadata({
      start: new UintN64(startBox),
      end: new UintN64(endBox),
      status: IN_PROGRESS,
      endSize: new UintN64(endBoxSize),
    });

    const dataIdentifierBytes = Bytes(dataIdentifier);
    assert(!this.metadata(dataIdentifierBytes).exists);

    this.metadata(dataIdentifierBytes).value = metadata.copy();

    this.currentIndex.value = endBox + 1;

    const totalCost: uint64 =
      numBoxes * COST_PER_BOX + // cost of boxes
      (numBoxes - 1) * MAX_BOX_SIZE * COST_PER_BYTE + // cost of data
      numBoxes * 64 * COST_PER_BYTE + // cost of keys
      endBoxSize * COST_PER_BYTE; // cost of last box data

    assertMatch(mbrPayment, {
      receiver: Global.currentApplicationAddress,
      amount: totalCost,
    });
  }

  /**
   *
   * Upload data to a specific offset in a box
   * `offset` parameter is removed as it is no longer used.
   *
   * @param dataIdentifier The unique identifier for the data
   * @param boxIndex The index of the box to upload the given chunk of data to
   * @param data The data to write
   */
  upload(dataIdentifier: string, boxIndex: uint64, data: bytes): void {
    const dataIdentifierBytes = Bytes(dataIdentifier);
    const metadata = this.metadata(dataIdentifierBytes).value.copy();
    assert(metadata.status === IN_PROGRESS);
    assert(
      metadata.start.native <= boxIndex && boxIndex <= metadata.end.native,
    );

    if (!this.dataBoxes(boxIndex).exists) {
      this.dataBoxes(boxIndex).value = data;
    } else {
      this.dataBoxes(boxIndex).value =
        this.dataBoxes(boxIndex).value.concat(data);
    }
  }

  /**
   *
   * Set the status of the data
   *
   * @param dataIdentifier The unique identifier for the data
   * @param status The new status for the data
   */
  setStatus(dataIdentifier: string, status: UintN<8>): void {
    const dataIdentifierBytes = Bytes(dataIdentifier);
    const currentStatus = this.metadata(dataIdentifierBytes).value.status;

    assert(status === READY || status === IMMUTABLE || status === IN_PROGRESS);
    assert(currentStatus !== IMMUTABLE);

    this.metadata(dataIdentifierBytes).value.status = status;
  }
}
