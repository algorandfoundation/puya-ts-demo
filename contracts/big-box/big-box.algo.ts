import {
  assert,
  assertMatch,
  BoxMap,
  Bytes,
  clone,
  Global,
  GlobalState,
  Contract,
} from "@algorandfoundation/algorand-typescript";
import type {
  bytes,
  gtxn,
  uint64,
} from "@algorandfoundation/algorand-typescript";
import { abimethod, Uint } from "@algorandfoundation/algorand-typescript/arc4";

/*
start - The index of the box at which the data starts
end - The index of the box at which the data ends
status - 0: in progress, 1: ready, 2: immutable
endSize - The size of the last box
*/
type Metadata = {
  start: uint64;
  end: uint64;
  status: Uint<8>;
  endSize: uint64;
};

const IN_PROGRESS = new Uint<8>(0);
const READY = new Uint<8>(1);
const IMMUTABLE = new Uint<8>(2);

const COST_PER_BYTE: uint64 = 400;
const COST_PER_BOX: uint64 = 2500;
const MAX_BOX_SIZE: uint64 = 32768;

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

    const metadata: Metadata = {
      start: startBox,
      end: endBox,
      status: IN_PROGRESS,
      endSize: endBoxSize,
    };

    const dataIdentifierBytes = Bytes(dataIdentifier);
    assert(!this.metadata(dataIdentifierBytes).exists);

    this.metadata(dataIdentifierBytes).value = clone(metadata);

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
   *
   * @param dataIdentifier The unique identifier for the data
   * @param boxIndex The index of the box to upload the given chunk of data to
   * @param offset The offset within the box to start writing the data
   * @param data The data to write
   */
  upload(
    dataIdentifier: string,
    boxIndex: uint64,
    offset: uint64,
    data: bytes,
  ): void {
    const metadata = clone(this.metadata(Bytes(dataIdentifier)).value);
    assert(metadata.status === IN_PROGRESS);
    assert(metadata.start <= boxIndex && boxIndex <= metadata.end);

    if (offset === 0) {
      this.dataBoxes(boxIndex).create({
        size: boxIndex === metadata.end ? metadata.endSize : MAX_BOX_SIZE,
      });
    }

    this.dataBoxes(boxIndex).replace(offset, data);
  }

  /**
   *
   * Set the status of the data
   *
   * @param dataIdentifier The unique identifier for the data
   * @param status The new status for the data
   */
  setStatus(dataIdentifier: string, status: Uint<8>): void {
    const dataIdentifierBytes = Bytes(dataIdentifier);
    const currentStatus = this.metadata(dataIdentifierBytes).value.status;

    assert(status === READY || status === IMMUTABLE || status === IN_PROGRESS);
    assert(currentStatus !== IMMUTABLE);

    this.metadata(dataIdentifierBytes).value.status = status;
  }
}
