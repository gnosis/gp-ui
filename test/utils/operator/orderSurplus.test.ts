import BigNumber from 'bignumber.js'

import { ONE_BIG_NUMBER, ONE_HUNDRED_BIG_NUMBER, ZERO_BIG_NUMBER } from 'const'

import { RawOrder } from 'api/operator'

import { getOrderSurplus, getSurplus } from 'utils'

import { RAW_ORDER } from '../../data'

const ZERO_DOT_ZERO_ONE = new BigNumber('0.01')
// const TWENTY_PERCENT = new BigNumber('0.2')

describe('getSurplus', () => {
  const inputAmount = ONE_HUNDRED_BIG_NUMBER

  test('executedAmount = 0', () => {
    const executedAmount = ZERO_BIG_NUMBER
    expect(getSurplus(inputAmount, executedAmount)).toEqual({ amount: ZERO_BIG_NUMBER, percentage: ZERO_BIG_NUMBER })
  })

  test('surplus 1%', () => {
    const executedAmount = ONE_BIG_NUMBER.plus(ONE_HUNDRED_BIG_NUMBER)
    expect(getSurplus(inputAmount, executedAmount)).toEqual({ amount: ONE_BIG_NUMBER, percentage: ZERO_DOT_ZERO_ONE })
  })
})

describe('getOrderSurplus', () => {
  describe('Buy order', () => {
    describe('fillOrKill', () => {
      test('With fees = 0', () => {
        const order: RawOrder = {
          ...RAW_ORDER,
          kind: 'buy',
          sellAmount: '100',
          executedSellAmount: '99',
          feeAmount: '0',
          executedFeeAmount: '0',
          partiallyFillable: false,
        }
        expect(getOrderSurplus(order)).toEqual({ amount: ONE_BIG_NUMBER, percentage: ZERO_DOT_ZERO_ONE })
      })
      test('With fees > 0', () => {
        const order: RawOrder = {
          ...RAW_ORDER,
          kind: 'buy',
          sellAmount: '110',
          executedSellAmount: '109',
          feeAmount: '10',
          executedFeeAmount: '10',
          partiallyFillable: false,
        }
        expect(getOrderSurplus(order)).toEqual({ amount: ONE_BIG_NUMBER, percentage: ZERO_DOT_ZERO_ONE })
      })
    })
    test('partiallyFillable', () => {
      const order: RawOrder = {
        ...RAW_ORDER,
        kind: 'buy',
        sellAmount: '100',
        executedSellAmount: '50',
        buyAmount: '100',
        executedBuyAmount: '40',
        partiallyFillable: true,
      }
      // TODO: uncomment when implemented
      // expect(getOrderSurplus(order)).toEqual({ amount: TEN_BIG_NUMBER, percentage: TWENTY_PERCENT })
      expect(() => getOrderSurplus(order)).toThrow('Not implemented')
    })
  })

  describe('Sell order', () => {
    describe('fillOrKill', () => {
      test('With fees = 0', () => {
        const order: RawOrder = {
          ...RAW_ORDER,
          kind: 'sell',
          buyAmount: '100',
          executedBuyAmount: '101',
          feeAmount: '0',
          executedFeeAmount: '0',
          partiallyFillable: false,
        }
        expect(getOrderSurplus(order)).toEqual({ amount: ONE_BIG_NUMBER, percentage: ZERO_DOT_ZERO_ONE })
      })
      test('With fees > 0', () => {
        const order: RawOrder = {
          ...RAW_ORDER,
          kind: 'sell',
          buyAmount: '100',
          executedBuyAmount: '101',
          feeAmount: '10',
          executedFeeAmount: '10',
          partiallyFillable: false,
        }
        expect(getOrderSurplus(order)).toEqual({ amount: ONE_BIG_NUMBER, percentage: ZERO_DOT_ZERO_ONE })
      })
    })
    test('partiallyFillable', () => {
      const order: RawOrder = {
        ...RAW_ORDER,
        kind: 'sell',
        buyAmount: '100',
        executedBuyAmount: '50',
        sellAmount: '100',
        executedSellAmount: '40',
        partiallyFillable: true,
      }
      // TODO: uncomment when implemented
      // expect(getOrderSurplus(order)).toEqual({ amount: TEN_BIG_NUMBER, percentage: TWENTY_PERCENT })
      expect(() => getOrderSurplus(order)).toThrow('Not implemented')
    })
  })
})
