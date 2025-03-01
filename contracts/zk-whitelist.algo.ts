import type { uint64 } from '@algorandfoundation/algorand-typescript'
import {
  abimethod,
  Account,
  arc4,
  assert,
  BigUint,
  Bytes,
  ensureBudget,
  Global,
  GlobalState,
  itxn,
  LocalState,
  op,
  OpUpFeeSource,
  TemplateVar,
  Txn,
} from '@algorandfoundation/algorand-typescript'

const curveMod = BigUint(21888242871839275222246405745257275088548364400416034343698204186575808495617n)
const verifierBudget: uint64 = 145000

export default class ZkWhitelistContract extends arc4.Contract {
  appName = GlobalState<string>({})
  whiteList = LocalState<boolean>()

  @abimethod({ onCreate: 'require' })
  create(name: string) {
    // Create the application
    this.appName.value = name
  }

  @abimethod({ allowActions: ['UpdateApplication', 'DeleteApplication'] })
  update() {
    // Update the application if it is mutable (manager only)
    assert(Global.creatorAddress === Txn.sender)
  }

  @abimethod({ allowActions: ['OptIn', 'CloseOut'] })
  optInOrOut() {
    // Opt in or out of the application
    return
  }

  @abimethod()
  addAddressToWhitelist(address: arc4.Address, proof: arc4.Address[]): string {
    /*
    Add caller to the whitelist if the zk proof is valid.
    On success, will return an empty string. Otherwise, will return an error
    message.
    */
    ensureBudget(verifierBudget, OpUpFeeSource.GroupCredit)
    // The verifier expects public inputs to be in the curve field, but an
    // Algorand address might represent a number larger than the field
    // modulus, so to be safe we take the address modulo the field modulus
    const addressMod = arc4.interpretAsArc4<arc4.Address>(op.bzero(32).bitwiseOr(Bytes(BigUint(address.bytes) % curveMod)))
    // Verify the proof by calling the deposit verifier app
    const verified = this.verifyProof(TemplateVar<uint64>('VERIFIER_APP_ID'), proof, [addressMod])
    if (!verified.native) {
      return 'Proof verification failed'
    }
    // if successful, add the sender to the whitelist by setting local state
    const account = Account(address.bytes)
    if (Txn.sender !== account) {
      return 'Sender address does not match authorized address'
    }
    this.whiteList(account).value = true
    return ''
  }

  @abimethod()
  isOnWhitelist(address: arc4.Address): boolean {
    // Check if an address is on the whitelist
    const account = address.native
    const optedIn = op.appOptedIn(account, Global.currentApplicationId)
    if (!optedIn) {
      return false
    }
    return this.whiteList(account).value
  }

  verifyProof(appId: uint64, proof: arc4.Address[], publicInputs: arc4.Address[]): arc4.Bool {
    // Verify a proof using the verifier app.
    const verified = itxn
      .applicationCall({
        appId: appId,
        fee: 0,
        // Commented out until https://github.com/algorandfoundation/puya-ts/issues/116 is resolved
        // appArgs: [arc4.methodSelector('verify(byte[32][],byte[32][])bool'), proof, arc4.encodeArc4(publicInputs)], 
        onCompletion: arc4.OnCompleteAction.NoOp,
      })
      .submit().lastLog
    return arc4.interpretAsArc4<arc4.Bool>(verified, 'log')
  }
}
