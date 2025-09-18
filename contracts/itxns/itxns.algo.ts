import {
  Contract,
  Global,
  itxn,
} from "@algorandfoundation/algorand-typescript";
import type { uint64 } from "@algorandfoundation/algorand-typescript";
import {
  abimethod,
  Address,
  compileArc4,
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
    const factory = compileArc4(NFTFactory);

    const factoryApp = factory.call.createApplication().itxn.createdApp;

    itxn
      .payment({
        amount: 200_000,
        receiver: factoryApp.address,
      })
      .submit();

    const createdAssetId = factory.call.createNFT({
      appId: factoryApp,
      args: ["My NFT", "MNFT"],
    }).returnValue;

    itxn
      .assetTransfer({
        assetReceiver: Global.currentApplicationAddress,
        assetAmount: 0,
        xferAsset: createdAssetId,
      })
      .submit();

    factory.call.transferNFT({
      appId: factoryApp,
      args: [createdAssetId, new Address(Global.currentApplicationAddress)],
    });

    return createdAssetId;
  }
}
