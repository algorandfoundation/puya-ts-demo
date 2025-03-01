import type { gtxn, uint64 } from '@algorandfoundation/algorand-typescript'
import { arc4, assert, Bytes, GlobalState, LocalState, op, Txn, Uint64 } from '@algorandfoundation/algorand-typescript'

export default class VotingContract extends arc4.Contract {
  topic = GlobalState({ initialValue: Bytes('default_topic'), key: Bytes('topic') })
  votes = GlobalState({ initialValue: Uint64(0), key: Bytes('votes') })
  voted = LocalState<uint64>({ key: Bytes('voted') })

  @arc4.abimethod()
  public setTopic(topic: string): void {
    this.topic.value = Bytes(topic)
  }
  @arc4.abimethod()
  public vote(pay: gtxn.PaymentTxn): boolean {
    assert(op.Global.groupSize === 2, 'Expected 2 transactions')
    assert(pay.amount === 10_000, 'Incorrect payment amount')
    assert(pay.sender === Txn.sender, 'Payment sender must match transaction sender')

    if (this.voted(Txn.sender).hasValue) {
      return false // Already voted
    }

    this.votes.value = this.votes.value + 1
    this.voted(Txn.sender).value = 1
    return true
  }

  @arc4.abimethod({ readonly: true })
  public getVotes(): uint64 {
    return this.votes.value
  }

  public clearStateProgram(): boolean {
    return true
  }
}
