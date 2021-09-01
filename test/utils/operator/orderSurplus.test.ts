import BigNumber from 'bignumber.js'

import { ONE_BIG_NUMBER, TEN_BIG_NUMBER, ZERO_BIG_NUMBER } from 'const'

import { RawOrder } from 'api/operator'

import { getOrderSurplus } from 'utils'

import { RAW_ORDER } from '../../data'

const ZERO_DOT_ZERO_ONE = new BigNumber('0.01')
const TWENTY_PERCENT = new BigNumber('0.2')

describe('getOrderSurplus', () => {
  describe('Buy order', () => {
    describe('fillOrKill', () => {
      test('No surplus', () => {
        const order: RawOrder = {
          ...RAW_ORDER,
          kind: 'buy',
          sellAmount: '100',
          executedSellAmount: '100',
          feeAmount: '0',
          executedFeeAmount: '0',
          partiallyFillable: false,
        }
        expect(getOrderSurplus(order)).toEqual({ amount: ZERO_BIG_NUMBER, percentage: ZERO_BIG_NUMBER })
      })
      test('No matches', () => {
        const order: RawOrder = {
          ...RAW_ORDER,
          kind: 'buy',
          sellAmount: '100',
          executedSellAmount: '0',
          feeAmount: '0',
          executedFeeAmount: '0',
          partiallyFillable: false,
        }
        expect(getOrderSurplus(order)).toEqual({ amount: ZERO_BIG_NUMBER, percentage: ZERO_BIG_NUMBER })
      })
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
          sellAmount: '100',
          executedSellAmount: '109', // 10 is the fee, total sold is 99; surplus === 1
          feeAmount: '10',
          executedFeeAmount: '10',
          partiallyFillable: false,
        }
        expect(getOrderSurplus(order)).toEqual({ amount: ONE_BIG_NUMBER, percentage: ZERO_DOT_ZERO_ONE })
      })
    })
    test.skip('partiallyFillable', () => {
      const order: RawOrder = {
        ...RAW_ORDER,
        kind: 'buy',
        sellAmount: '100',
        executedSellAmount: '50',
        buyAmount: '100',
        executedBuyAmount: '40',
        partiallyFillable: true,
      }
      expect(getOrderSurplus(order)).toEqual({ amount: TEN_BIG_NUMBER, percentage: TWENTY_PERCENT })
    })
  })

  describe('Sell order', () => {
    describe('fillOrKill', () => {
      test('No surplus', () => {
        const order: RawOrder = {
          ...RAW_ORDER,
          kind: 'sell',
          buyAmount: '100',
          executedBuyAmount: '100',
          feeAmount: '0',
          executedFeeAmount: '0',
          partiallyFillable: false,
        }
        expect(getOrderSurplus(order)).toEqual({ amount: ZERO_BIG_NUMBER, percentage: ZERO_BIG_NUMBER })
      })
      test('No matches', () => {
        const order: RawOrder = {
          ...RAW_ORDER,
          kind: 'sell',
          buyAmount: '100',
          executedBuyAmount: '0',
          feeAmount: '0',
          executedFeeAmount: '0',
          partiallyFillable: false,
        }
        expect(getOrderSurplus(order)).toEqual({ amount: ZERO_BIG_NUMBER, percentage: ZERO_BIG_NUMBER })
      })
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
    test.skip('partiallyFillable', () => {
      const order: RawOrder = {
        ...RAW_ORDER,
        kind: 'sell',
        buyAmount: '100',
        executedBuyAmount: '50',
        sellAmount: '100',
        executedSellAmount: '40',
        partiallyFillable: true,
      }
      expect(getOrderSurplus(order)).toEqual({ amount: TEN_BIG_NUMBER, percentage: TWENTY_PERCENT })
    })
  })
})
