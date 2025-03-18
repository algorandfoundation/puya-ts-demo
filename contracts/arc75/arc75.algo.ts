import {
  assert,
  assertMatch,
  BoxMap,
  Bytes,
  Contract,
  Global,
  itxn,
  Txn,
} from "@algorandfoundation/algorand-typescript";
import { gtxn } from "@algorandfoundation/algorand-typescript";
import type { uint64 } from "@algorandfoundation/algorand-typescript";
import {
  abimethod,
  Address,
  DynamicArray,
  Str,
  Struct,
  UintN16,
  UintN64,
} from "@algorandfoundation/algorand-typescript/arc4";

export class Whitelist extends Struct<{
  account: Address;
  boxIndex: UintN16;
  arc: Str;
}> {}

export class ARC75 extends Contract {
  whitelist = BoxMap<Whitelist, DynamicArray<UintN64>>({ keyPrefix: Bytes() });

  private verifyMBRPayment(payment: gtxn.PaymentTxn, preMBR: uint64): void {
    assertMatch(payment, {
      receiver: Global.currentApplicationAddress,
      amount: Global.currentApplicationAddress.minBalance - preMBR,
    });
  }

  private sendMBRPayment(preMBR: uint64): void {
    itxn
      .payment({
        receiver: Txn.sender,
        amount: preMBR - Global.currentApplicationAddress.minBalance,
      })
      .submit();
  }

  @abimethod({ onCreate: "require" })
  createApplication(): void {}

  /**
   * Add app to whitelist box
   *
   * @param arc - The ARC the whitelist corresponds to
   * @param boxIndex - The index of the whitelist box to add the app to
   * @param appID - The app ID to add to the whitelist
   * @param payment - The payment transaction to cover the MBR change
   *
   */
  addAppToWhiteList(
    arc: string,
    boxIndex: UintN16,
    appID: uint64,
    payment: gtxn.PaymentTxn,
  ): void {
    const preMBR = Global.currentApplicationAddress.minBalance;
    const whitelist = new Whitelist({
      account: new Address(Txn.sender),
      boxIndex: boxIndex,
      arc: new Str(arc),
    });

    if (this.whitelist(whitelist).exists) {
      this.whitelist(whitelist).value.push(new UintN64(appID));
    } else {
      const newWhitelist = new DynamicArray<UintN64>(new UintN64(appID));
      this.whitelist(whitelist).value = newWhitelist.copy();
    }

    this.verifyMBRPayment(payment, preMBR);
  }

  /**
   * Sets a app whitelist for the sender. Should only be used when adding/removing
   * more than one app
   *
   * @param boxIndex - The index of the whitelist box to put the app IDs in
   * @param appIDs - Array of app IDs that signify the whitelisted apps
   *
   */
  setAppWhitelist(arc: string, boxIndex: UintN16, appIDs: uint64[]): void {
    const preMBR = Global.currentApplicationAddress.minBalance;
    const whitelist = new Whitelist({
      account: new Address(Txn.sender),
      boxIndex: boxIndex,
      arc: new Str(arc),
    });

    this.whitelist(whitelist).delete();

    const newWhitelist = new DynamicArray<UintN64>();
    for (let i: uint64 = 0; i < appIDs.length; i++) {
      newWhitelist.push(new UintN64(appIDs[i]));
    }

    this.whitelist(whitelist).value = newWhitelist.copy();

    if (preMBR > Global.currentApplicationAddress.minBalance) {
      this.sendMBRPayment(preMBR);
    } else {
      this.verifyMBRPayment(gtxn.PaymentTxn(Txn.groupIndex - 1), preMBR);
    }
  }

  /**
   * Deletes a app whitelist for the sender
   *
   * @param arc - The ARC the whitelist corresponds to
   * @param boxIndex - The index of the whitelist box to delete
   *
   */
  deleteWhitelist(arc: string, boxIndex: UintN16): void {
    const preMBR = Global.currentApplicationAddress.minBalance;
    const whitelist = new Whitelist({
      account: new Address(Txn.sender),
      boxIndex: boxIndex,
      arc: new Str(arc),
    });

    this.whitelist(whitelist).delete();

    this.sendMBRPayment(preMBR);
  }

  /**
   * Deletes a app from a whitelist for the sender
   *
   * @param boxIndex - The index of the whitelist box to delete from
   * @param appID - The app ID to delete from the whitelist
   * @param index - The index of the app in the whitelist
   *
   */
  deleteAppFromWhitelist(
    arc: string,
    boxIndex: UintN16,
    appID: uint64,
    index: uint64,
  ): void {
    const preMBR = Global.currentApplicationAddress.minBalance;
    const whitelist = new Whitelist({
      account: new Address(Txn.sender),
      boxIndex: boxIndex,
      arc: new Str(arc),
    });

    const spliced = this.whitelist(whitelist).value.at(index);

    const newWhiteList = new DynamicArray<UintN64>();
    for (let i: uint64 = 0; i < this.whitelist(whitelist).value.length; i++) {
      if (i !== index) {
        newWhiteList.push(this.whitelist(whitelist).value.at(i));
      }
    }
    this.whitelist(whitelist).value = newWhiteList.copy();

    assert(spliced.native === appID);

    this.sendMBRPayment(preMBR);
  }
}
