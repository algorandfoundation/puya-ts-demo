import {
  Application,
  assert,
  assertMatch,
  BoxMap,
  Bytes,
  Contract,
  Global,
  gtxn,
  LogicSig,
  TemplateVar,
  Txn,
} from "@algorandfoundation/algorand-typescript";
import {
  abimethod,
  Address,
  Bool,
  methodSelector,
  Tuple,
} from "@algorandfoundation/algorand-typescript/arc4";
import { GTxn } from "@algorandfoundation/algorand-typescript/op";

/**
 * This lsig approves transactions that opt in to an asset AND
 * call the verifyCreator method in our app
 */

export class OptInLsig extends LogicSig {
  /** Verify this is an opt in transaction */
  program(): boolean {
    /** Verify that the transaction this logic signature is approving is an ASA opt-in */
    assertMatch(Txn, {
      assetAmount: 0,
      assetReceiver: Txn.sender,
      // It's very important to set fee to 0 for delegated logic signatures
      // Otherwise the fee can be used to drain the signer's account
      fee: 0,
      // Also very important to check that the rekey is set to zero address
      rekeyTo: Global.zeroAddress,
      // Finally we must ensure that this is not a close transaction, which will drain the signer's account of the given asset
      assetCloseTo: Global.zeroAddress,
    });

    const appCall = gtxn.ApplicationTxn(Txn.groupIndex + 1);
    // Use assert instead of verifyTxn because applicationArgs array is not yet supported in verifyTxn
    assert(appCall.appId === TemplateVar<Application>("APP_ID"));
    assert(appCall.appArgs(0) === methodSelector("verifyCreator(axfer)void"));
    return true;
  }
}

export class CreatorVerifier extends Contract {
  @abimethod({ onCreate: "require" })
  createApplication(): void {}

  /** Mapping of [user,creator] to determine which creators the user will allow opt-ins from */
  allowedCreators = BoxMap<Tuple<[Address, Address]>, Bool>({
    keyPrefix: Bytes(),
  });

  /** Allow anyone to use the lsig to opt in the txn sender into an asset created by the creator */
  allowOptInsFrom(creator: Address): void {
    this.allowedCreators(new Tuple(new Address(Txn.sender), creator)).value =
      new Bool(true);
  }

  /** Disable opt-ins for ASAs from the given creator */
  disableOptInsFrom(creator: Address): void {
    this.allowedCreators(new Tuple(new Address(Txn.sender), creator)).value =
      new Bool(false);
  }

  // eslint-disable-next-line no-unused-vars
  verifyCreator(optIn: gtxn.AssetTransferTxn): void {
    /** assert that the user has allowed optIns from the ASA creator */
    assert(
      this.allowedCreators(
        new Tuple(
          new Address(optIn.sender),
          new Address(optIn.xferAsset.creator),
        ),
      ).value.native,
    );
  }
}
