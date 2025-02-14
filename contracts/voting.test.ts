import { TestExecutionContext } from '@algorandfoundation/algorand-typescript-testing'
import { afterEach, describe, expect, test } from '@jest/globals'
import VotingContract from './voting.algo'
import { Uint64 } from '@algorandfoundation/algorand-typescript'

describe('Voting contract', () => {
  const ctx = new TestExecutionContext()
  afterEach(() => {
    ctx.reset()
  })

  test('vote function', () => {
    // Initialize the contract within the testing context
    const contract = ctx.contract.create(VotingContract)

    const voter = ctx.defaultSender
    const payment = ctx.any.txn.payment({
      sender: voter,
      amount: 10_000,
    })

    const result = contract.vote(payment)
    expect(result.native).toEqual(true)    
    expect(contract.votes.value).toEqual(1)
    expect(contract.voted(voter).value).toEqual(1)    
  })

  test('setTopic function', () => {
    // Initialize the contract within the testing context
    const contract = ctx.contract.create(VotingContract)

    const newTopic = ctx.any.string(10)
    contract.setTopic(newTopic)
    expect(contract.topic.value).toEqual(newTopic)
  })

  test('getVotes function', () => {
    // Initialize the contract within the testing context
    const contract = ctx.contract.create(VotingContract)

    contract.votes.value = Uint64(5)
    const votes = contract.getVotes()
    expect(votes.native).toEqual(5)
  })
})
