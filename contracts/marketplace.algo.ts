import type {
  Asset,
  gtxn,
  uint64,
} from "@algorandfoundation/algorand-typescript";
import {
  arc4,
  assert,
  BoxMap,
  Global,
  itxn,
  op,
  Txn,
} from "@algorandfoundation/algorand-typescript";

export type ListingKey = {
  owner: arc4.Address;
  asset: uint64;
  nonce: uint64;
};

export type ListingValue = {
  deposited: uint64;
  unitaryPrice: uint64;
  bidder: arc4.Address;
  bid: uint64;
  bidUnitaryPrice: uint64;
};

export default class DigitalMarketplace extends arc4.Contract {
  listings = BoxMap<ListingKey, ListingValue>({ keyPrefix: "listings" });

  listingsBoxMbr(): uint64 {
    return (
      2_500 +
      // fmt: off
      // Key length
      (8 +
        32 +
        8 +
        8 +
        // Value length
        8 +
        8 +
        32 +
        8 +
        8) *
        // fmt: on
        400
    );
  }

  quantityPrice(
    quantity: uint64,
    price: uint64,
    assetDecimals: uint64,
  ): uint64 {
    const [amountNotScaledHigh, amountNotScaledLow] = op.mulw(price, quantity);
    const [scalingFactorHigh, scalingFactorLow] = op.expw(10, assetDecimals);
    const [_quotientHigh, amountToBePaid, _remainderHigh, _remainderLow] =
      op.divmodw(
        amountNotScaledHigh,
        amountNotScaledLow,
        scalingFactorHigh,
        scalingFactorLow,
      );
    assert(_quotientHigh === 0);

    return amountToBePaid;
  }

  @arc4.abimethod({ readonly: true })
  getListingsMbr(): uint64 {
    return this.listingsBoxMbr();
  }

  @arc4.abimethod()
  allowAsset(mbrPay: gtxn.PaymentTxn, asset: Asset) {
    assert(!Global.currentApplicationAddress.isOptedIn(asset));

    assert(mbrPay.receiver === Global.currentApplicationAddress);
    assert(mbrPay.amount === Global.assetOptInMinBalance);

    itxn
      .assetTransfer({
        xferAsset: asset,
        assetReceiver: Global.currentApplicationAddress,
        assetAmount: 0,
      })
      .submit();
  }

  @arc4.abimethod()
  firstDeposit(
    mbrPay: gtxn.PaymentTxn,
    xfer: gtxn.AssetTransferTxn,
    unitaryPrice: uint64,
    nonce: uint64,
  ) {
    assert(mbrPay.sender === Txn.sender);
    assert(mbrPay.receiver === Global.currentApplicationAddress);
    assert(mbrPay.amount === this.listingsBoxMbr());

    const key: ListingKey = {
      owner: new arc4.Address(Txn.sender),
      asset: xfer.xferAsset.id,
      nonce: nonce,
    };
    assert(!this.listings(key).exists);

    assert(xfer.sender === Txn.sender);
    assert(xfer.assetReceiver === Global.currentApplicationAddress);
    assert(xfer.assetAmount > 0);

    this.listings(key).value = {
      deposited: xfer.assetAmount,
      unitaryPrice: unitaryPrice,
      bidder: new arc4.Address(),
      bid: 0,
      bidUnitaryPrice: 0,
    };
  }

  @arc4.abimethod()
  deposit(xfer: gtxn.AssetTransferTxn, nonce: uint64) {
    const key: ListingKey = {
      owner: new arc4.Address(Txn.sender),
      asset: xfer.xferAsset.id,
      nonce: nonce,
    };

    assert(xfer.sender === Txn.sender);
    assert(xfer.assetReceiver === Global.currentApplicationAddress);
    assert(xfer.assetAmount > 0);

    this.listings(key).value.deposited =
      this.listings(key).value.deposited + xfer.assetAmount;
  }

  @arc4.abimethod()
  setPrice(asset: Asset, nonce: uint64, unitaryPrice: uint64) {
    const key: ListingKey = {
      owner: new arc4.Address(Txn.sender),
      asset: asset.id,
      nonce: nonce,
    };

    this.listings(key).value.unitaryPrice = unitaryPrice;
  }

  @arc4.abimethod()
  buy(
    owner: arc4.Address,
    asset: Asset,
    nonce: uint64,
    buyPay: gtxn.PaymentTxn,
    quantity: uint64,
  ) {
    const key: ListingKey = {
      owner: owner,
      asset: asset.id,
      nonce: nonce,
    };

    const listing = this.listings(key).value;

    const amountToBePaid = this.quantityPrice(
      quantity,
      listing.unitaryPrice,
      asset.decimals,
    );

    assert(buyPay.sender === Txn.sender);
    assert(buyPay.receiver.bytes === owner.bytes);
    assert(buyPay.amount === amountToBePaid);

    this.listings(key).value.deposited = listing.deposited - quantity;

    itxn
      .assetTransfer({
        xferAsset: asset,
        assetReceiver: Txn.sender,
        assetAmount: quantity,
      })
      .submit();
  }

  @arc4.abimethod()
  withdraw(asset: Asset, nonce: uint64) {
    const key: ListingKey = {
      owner: new arc4.Address(Txn.sender),
      asset: asset.id,
      nonce: nonce,
    };

    const listing = this.listings(key).value;

    if (listing.bidder !== new arc4.Address()) {
      const currentBidDeposit = this.quantityPrice(
        listing.bid,
        listing.bidUnitaryPrice,
        asset.decimals,
      );
      itxn
        .payment({ receiver: listing.bidder.native, amount: currentBidDeposit })
        .submit();
    }

    this.listings(key).delete();

    itxn
      .payment({ receiver: Txn.sender, amount: this.listingsBoxMbr() })
      .submit();

    itxn
      .assetTransfer({
        xferAsset: asset,
        assetReceiver: Txn.sender,
        assetAmount: listing.deposited,
      })
      .submit();
  }

  @arc4.abimethod()
  bid(
    owner: arc4.Address,
    asset: Asset,
    nonce: uint64,
    bidPay: gtxn.PaymentTxn,
    quantity: uint64,
    unitaryPrice: uint64,
  ) {
    const key: ListingKey = {
      owner,
      asset: asset.id,
      nonce,
    };

    const listing = this.listings(key).value;
    if (listing.bidder !== new arc4.Address()) {
      assert(unitaryPrice > listing.bidUnitaryPrice);

      const currentBidAmount = this.quantityPrice(
        listing.bid,
        listing.bidUnitaryPrice,
        asset.decimals,
      );

      itxn
        .payment({ receiver: listing.bidder.native, amount: currentBidAmount })
        .submit();
    }

    const amountToBeBid = this.quantityPrice(quantity, unitaryPrice, asset.id);

    assert(bidPay.sender === Txn.sender);
    assert(bidPay.receiver === Global.currentApplicationAddress);
    assert(bidPay.amount === amountToBeBid);

    this.listings(key).value = {
      deposited: listing.deposited,
      unitaryPrice: listing.unitaryPrice,
      bidder: new arc4.Address(Txn.sender),
      bid: quantity,
      bidUnitaryPrice: unitaryPrice,
    };
  }

  @arc4.abimethod()
  acceptBid(asset: Asset, nonce: uint64) {
    const key: ListingKey = {
      owner: new arc4.Address(Txn.sender),
      asset: asset.id,
      nonce,
    };

    const listing = this.listings(key).value;
    assert(listing.bidder !== new arc4.Address());

    const minQuantity =
      listing.deposited < listing.bid ? listing.deposited : listing.bid;

    const bestBidAmount = this.quantityPrice(
      minQuantity,
      listing.bidUnitaryPrice,
      asset.decimals,
    );

    itxn.payment({ receiver: Txn.sender, amount: bestBidAmount }).submit();

    itxn
      .assetTransfer({
        xferAsset: asset,
        assetReceiver: listing.bidder.native,
        assetAmount: minQuantity,
      })
      .submit();

    this.listings(key).value = {
      bidder: listing.bidder,
      bidUnitaryPrice: listing.bidUnitaryPrice,
      unitaryPrice: listing.unitaryPrice,
      deposited: listing.deposited - minQuantity,
      bid: listing.bid - minQuantity,
    };
  }
}
