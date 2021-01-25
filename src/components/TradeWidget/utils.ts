import { tokenListApi } from 'apps/gp-v1/api'
import { isAddress } from 'web3-utils'
import { parseBigNumber, getToken, amountToPrecisionDown } from 'utils'
import { buildSearchQuery } from 'hooks/useQuery'
import { encodeTokenSymbol } from '@gnosis.pm/dex-js'

import { BATCH_START_THRESHOLD } from './validationSchema'
import { BATCH_TIME_IN_MS } from 'const'
import { TokenDetails } from 'types'

export function calculateReceiveAmount(priceValue: string, sellValue: string, receiveTokenPrecision: number): string {
  let receiveAmount = ''
  if (priceValue && sellValue) {
    const sellAmount = parseBigNumber(sellValue)
    const price = parseBigNumber(priceValue)

    if (sellAmount && price) {
      const receiveBigNumber = sellAmount.div(price)
      const receiveAmountToPrecision = amountToPrecisionDown(receiveBigNumber, receiveTokenPrecision)
      // Format the "Receive at least" input amount same as PriceSuggestions price
      receiveAmount =
        receiveAmountToPrecision?.isNaN() || !receiveAmountToPrecision?.isFinite()
          ? '0'
          : receiveAmountToPrecision.toString(10)
    }
  }

  return receiveAmount
}

export const preprocessTokenAddressesToAdd = (addresses: (string | undefined)[], networkId: number): string[] => {
  const tokenAddresses: string[] = []
  const addedSet = new Set()

  addresses.forEach((address) => {
    if (
      address &&
      !addedSet.has(address) &&
      !tokenListApi.hasToken({ tokenAddress: address, networkId }) &&
      isAddress(address.toLowerCase())
    ) {
      tokenAddresses.push(address)
      addedSet.add(address)
    }
  })

  return tokenAddresses
}

interface ChooseTokenInput {
  tokens: TokenDetails[]
  token: TokenDetails | null
  tokenSymbolFromUrl?: string
  defaultTokenSymbol: string
}

export const chooseTokenWithFallback = ({
  tokens,
  token,
  tokenSymbolFromUrl,
  defaultTokenSymbol,
}: ChooseTokenInput): TokenDetails | undefined => {
  if (tokenSymbolFromUrl && isAddress(tokenSymbolFromUrl?.toLowerCase())) {
    return getToken('address', tokenSymbolFromUrl, tokens)
  } else {
    return (
      getToken('symbol', token?.symbol, tokens) ||
      getToken('symbol', tokenSymbolFromUrl, tokens) ||
      getToken('symbol', defaultTokenSymbol, tokens)
    )
  }
}

export function buildUrl(params: {
  sell?: string
  price?: string
  from?: string | null
  expires?: string | null
  sellToken: TokenDetails
  buyToken: TokenDetails
}): string {
  const { sell, price, from, expires, sellToken, buyToken } = params

  const searchQuery = buildSearchQuery({
    sell: sell || '',
    price: price || '',
    from: from || '',
    expires: expires || '',
  })

  return `/trade/${encodeTokenSymbol(buyToken)}-${encodeTokenSymbol(sellToken)}?${searchQuery}`
}

export const calculateValidityTimes = (timeSelected?: string | null): string => {
  if (!timeSelected || Date.now() + BATCH_TIME_IN_MS * BATCH_START_THRESHOLD > +timeSelected) return ''

  return timeSelected.toString()
}
