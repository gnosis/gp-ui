import BigNumber from 'bignumber.js'

import { ONE_BIG_NUMBER, ONE_HUNDRED_BIG_NUMBER, TEN_BIG_NUMBER } from 'const'

import { RawOrder } from 'api/operator'
import { getOrderLimitPrice } from 'api/operator/utils'

import { ORDER } from '../../data'

const ZERO_DOT_ONE = new BigNumber('0.1')

describe('Buy order', () => {
  const order: RawOrder = { ...ORDER, kind: 'buy', buyAmount: '1000', sellAmount: '100' }

  test('Buy token decimals == sell token decimals', () => {
    expect(getOrderLimitPrice({ order, buyTokenDecimals: 2, sellTokenDecimals: 2 })).toEqual(TEN_BIG_NUMBER)
  })
  test('Buy token decimals > sell token decimals', () => {
    expect(getOrderLimitPrice({ order, buyTokenDecimals: 2, sellTokenDecimals: 1 })).toEqual(ONE_BIG_NUMBER)
  })
  test('Buy token decimals < sell token decimals', () => {
    expect(getOrderLimitPrice({ order, buyTokenDecimals: 1, sellTokenDecimals: 2 })).toEqual(ONE_HUNDRED_BIG_NUMBER)
  })
  test('Inverted price', () => {
    expect(getOrderLimitPrice({ order, buyTokenDecimals: 2, sellTokenDecimals: 2, inverted: true })).toEqual(
      ZERO_DOT_ONE,
    )
  })
})

describe('Sell order', () => {
  const order: RawOrder = { ...ORDER, kind: 'sell', buyAmount: '1000', sellAmount: '100' }

  test('Buy token decimals == sell token decimals', () => {
    expect(getOrderLimitPrice({ order, buyTokenDecimals: 2, sellTokenDecimals: 2 })).toEqual(TEN_BIG_NUMBER)
  })
  test('Buy token decimals > sell token decimals', () => {
    expect(getOrderLimitPrice({ order, buyTokenDecimals: 2, sellTokenDecimals: 1 })).toEqual(ONE_BIG_NUMBER)
  })
  test('Buy token decimals < sell token decimals', () => {
    expect(getOrderLimitPrice({ order, buyTokenDecimals: 1, sellTokenDecimals: 2 })).toEqual(ONE_HUNDRED_BIG_NUMBER)
  })
  test('Inverted price', () => {
    expect(getOrderLimitPrice({ order, buyTokenDecimals: 2, sellTokenDecimals: 2, inverted: true })).toEqual(
      ZERO_DOT_ONE,
    )
  })
})
