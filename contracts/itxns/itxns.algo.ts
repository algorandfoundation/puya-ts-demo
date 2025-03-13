import {
  compile,
  Contract,
  Global,
  itxn,
} from "@algorandfoundation/algorand-typescript";
import type { uint64 } from "@algorandfoundation/algorand-typescript";
import {
  abimethod,
  Address,
  decodeArc4,
  methodSelector,
} from "@algorandfoundation/algorand-typescript/arc4";

export class NFTFactory extends Contract {
  @abimethod({ onCreate: "require" })
  createApplication(): void {}

  createNFT(name: string, unitName: string): uint64 {
    return itxn
      .assetConfig({
        assetName: name,
        unitName: unitName,
        total: 1,
      })
      .submit().createdAsset.id;
  }

  transferNFT(assetId: uint64, receiver: Address): void {
    itxn
      .assetTransfer({
        assetReceiver: receiver.native,
        assetAmount: 1,
        xferAsset: assetId,
      })
      .submit();
  }
}

export class FactoryCaller extends Contract {
  @abimethod({ onCreate: "require" })
  createApplication(): void {}

  mintAndGetAsset(): uint64 {
    const factory = compile(NFTFactory);
    const factoryApp = itxn
      .applicationCall({
        appArgs: [methodSelector(NFTFactory.prototype.createApplication)],
        approvalProgram: factory.approvalProgram,
        clearStateProgram: factory.clearStateProgram,
      })
      .submit().createdApp;

    itxn
      .payment({
        amount: 200_000,
        receiver: factoryApp.address,
      })
      .submit();

    const createNFTTxn = itxn
      .applicationCall({
        appArgs: [
          methodSelector(NFTFactory.prototype.createNFT),
          "My NFT",
          "MNFT",
        ],
        appId: factoryApp,
      })
      .submit();
    const createdAssetId = decodeArc4<uint64>(createNFTTxn.lastLog, "log");

    itxn
      .assetTransfer({
        assetReceiver: Global.currentApplicationAddress,
        assetAmount: 0,
        xferAsset: createdAssetId,
      })
      .submit();

    itxn
      .applicationCall({
        appArgs: [
          methodSelector(NFTFactory.prototype.transferNFT),
          createdAssetId,
          Global.currentApplicationAddress,
        ],
        appId: factoryApp,
      })
      .submit();

    return createdAssetId;
  }
}
