import BigNumber from 'bignumber.js'

import { ONE_BIG_NUMBER, ONE_HUNDRED_BIG_NUMBER, TEN_BIG_NUMBER } from 'const'

import { RawOrder } from 'api/operator'
import { getOrderExecutedPrice, getOrderLimitPrice, GetOrderPriceParams } from 'api/operator/utils'

import { ORDER } from '../../data'

const ZERO_DOT_ONE = new BigNumber('0.1')

function _assertOrderPrice(order: RawOrder, getPriceFn: (params: GetOrderPriceParams) => BigNumber): void {
  test('Buy token decimals == sell token decimals', () => {
    expect(getPriceFn({ order, buyTokenDecimals: 2, sellTokenDecimals: 2 })).toEqual(TEN_BIG_NUMBER)
  })
  test('Buy token decimals > sell token decimals', () => {
    expect(getPriceFn({ order, buyTokenDecimals: 2, sellTokenDecimals: 1 })).toEqual(ONE_BIG_NUMBER)
  })
  test('Buy token decimals < sell token decimals', () => {
    expect(getPriceFn({ order, buyTokenDecimals: 1, sellTokenDecimals: 2 })).toEqual(ONE_HUNDRED_BIG_NUMBER)
  })
  test('Inverted price', () => {
    expect(getPriceFn({ order, buyTokenDecimals: 2, sellTokenDecimals: 2, inverted: true })).toEqual(ZERO_DOT_ONE)
  })
}

describe('Limit price', () => {
  describe('Buy order', () => {
    const order: RawOrder = { ...ORDER, kind: 'buy', buyAmount: '1000', sellAmount: '100' }

    _assertOrderPrice(order, getOrderLimitPrice)
  })

  describe('Sell order', () => {
    const order: RawOrder = { ...ORDER, kind: 'sell', buyAmount: '1000', sellAmount: '100' }

    _assertOrderPrice(order, getOrderLimitPrice)
  })
})

describe('Executed price', () => {
  describe('Buy order', () => {
    const order: RawOrder = {
      ...ORDER,
      kind: 'buy',
      executedBuyAmount: '1000',
      executedSellAmount: '110',
      executedFeeAmount: '10',
    }

    _assertOrderPrice(order, getOrderExecutedPrice)
  })

  describe('Sell order', () => {
    const order: RawOrder = {
      ...ORDER,
      kind: 'sell',
      executedBuyAmount: '1000',
      executedSellAmount: '110',
      executedFeeAmount: '10',
    }

    _assertOrderPrice(order, getOrderExecutedPrice)
  })
})
