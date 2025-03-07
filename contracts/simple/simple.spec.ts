import { TestExecutionContext } from '@algorandfoundation/algorand-typescript-testing'
import { afterEach, describe, expect, test } from 'vitest'
import Simple from './simple.algo'

describe('Simple', () => {
  const ctx = new TestExecutionContext()

  afterEach(() => {
    ctx.reset()
  })

  test('should increment counter', () => {
    const simple = ctx.contract.create(Simple)

    simple.incr(1)
    simple.incr(1)
    simple.incr(1)

    expect(simple.counter.value).toEqual(3)
  })

  test('should correctly add two biguints', () => {
    const simple = ctx.contract.create(Simple)

    const addResult = simple.add(123n, 456n)

    expect(addResult).toEqual(123n + 456n)
  })

  test('should correctly subtract two biguints', () => {
    const simple = ctx.contract.create(Simple)

    const subResult = simple.sub(5n, 3n)

    expect(subResult).toEqual(5n - 3n)
  })
})