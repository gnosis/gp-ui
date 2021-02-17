import BigNumber from 'bignumber.js'

import { Network } from 'types'

export type OrderID = string

export interface OrderPostError {
  errorType: 'MissingOrderData' | 'InvalidSignature' | 'DuplicateOrder' | 'InsufficientFunds'
  description: string
}

export interface FeeInformation {
  expirationDate: string
  minimalFee: string
  feeRatio: number
}

export type OrderKind = 'sell' | 'buy'

export type OrderStatus = 'open' | 'filled' | 'expired' | 'partially filled'

// Raw API response
export type RawOrder = {
  creationDate: string
  owner: string
  uid: string
  executedBuyAmount: string
  executedSellAmount: string
  executedFeeAmount: string
  invalidated: boolean
  sellToken: string
  buyToken: string
  sellAmount: string
  buyAmount: string
  validTo: number
  appData: number
  feeAmount: string
  kind: OrderKind
  partiallyFillable: boolean
  signature: string
}

/**
 * Enriched Order type.
 * Applies some transformations on the raw api data.
 * Some fields are kept as is.
 */
export type Order = Pick<RawOrder, 'owner' | 'uid' | 'appData' | 'kind' | 'partiallyFillable' | 'signature'> & {
  creationDate: Date
  expirationDate: Date
  buyTokenAddress: string
  sellTokenAddress: string
  buyAmount: BigNumber
  sellAmount: BigNumber
  executedBuyAmount: BigNumber
  executedSellAmount: BigNumber
  feeAmount: BigNumber
  executedFeeAmount: BigNumber
  cancelled: boolean
  // status: OrderStatus // better not have the status because it depends on `expirationDate`
  filledAmount: BigNumber
  filledPercentage: BigNumber
  // limitPrice: BigNumber  // cant have prices because they depend on token decimals
  // executedPrice: BigNumber
}

type WithNetworkId = { networkId: Network }

export type GetOrderParams = WithNetworkId & {
  orderId: string
}

export type GetOrdersParams = WithNetworkId & {
  owner?: string
  sellToken?: string
  buyToken?: string
}
