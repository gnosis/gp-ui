import { tokenListApi, exchangeApi, erc20Api, web3, theGraphApi } from 'api'

import {
  getTokenFromExchangeByAddressFactory,
  getTokenFromExchangeByIdFactory,
  addTokenToExchangeFactory,
  getPriceEstimationFactory,
  subscribeToTokenListFactory,
  getTokensFactory,
  getTokenFromErc20Factory,
} from './factories'

import { logDebug } from 'utils'
import { TokenDetails } from 'types'

const apis = {
  tokenListApi,
  exchangeApi,
  erc20Api,
  web3,
  theGraphApi,
}

export const getTokenFromErc20 = getTokenFromErc20Factory(apis)

export const getTokenFromExchangeByAddress = getTokenFromExchangeByAddressFactory(apis, { getTokenFromErc20 })

export const getTokenFromExchangeById = getTokenFromExchangeByIdFactory(apis, { getTokenFromErc20 })

export const addTokenToExchangeContract = addTokenToExchangeFactory(apis)

export const getPriceEstimation = getPriceEstimationFactory(apis)

export const subscribeToTokenList = subscribeToTokenListFactory(apis)

export const getTokens = getTokensFactory(apis)

export interface AddTokenToListParams {
  networkId: number
  tokenAddress: string
}
export interface AddTokenToExchangeParams extends AddTokenToListParams {
  userAddress: string
}

interface AddTokenResultSuccess {
  success: true
  tokenList: TokenDetails[]
  token: TokenDetails
  error: null
}

interface AddTokenResultFailure {
  success: false
  tokenList: TokenDetails[]
  token: null
  error: string
}
type AddTokenResult = AddTokenResultSuccess | AddTokenResultFailure

export const isTokenAddedSuccess = (result: AddTokenResult): result is AddTokenResultSuccess => result.success

export const addTokenToList = async ({ networkId, tokenAddress }: AddTokenToListParams): Promise<AddTokenResult> => {
  const checkSumAddress = web3.utils.toChecksumAddress(tokenAddress)
  const { token } = await getTokenFromExchangeByAddress({ networkId, tokenAddress: checkSumAddress })
  if (token) {
    logDebug('Added new Token to userlist', token)

    tokenListApi.addToken({ token, networkId })

    return {
      success: true,
      tokenList: tokenListApi.getTokens(networkId),
      token,
      error: null,
    }
  }

  const error = `Token at address ${tokenAddress} not available in Exchange contract`
  logDebug('[services:addTokenToList]', error)

  return {
    success: false,
    tokenList: tokenListApi.getTokens(networkId),
    token,
    error,
  }
}

export const addTokenToExchange = async ({
  userAddress,
  networkId,
  tokenAddress,
}: AddTokenToExchangeParams): Promise<AddTokenResult> => {
  const checkSumAddress = web3.utils.toChecksumAddress(tokenAddress)
  const token = await addTokenToExchangeContract({ userAddress, networkId, tokenAddress: checkSumAddress })
  if (token) {
    logDebug('Added new Token to userlist', token)

    tokenListApi.addToken({ token, networkId })

    return {
      success: true,
      tokenList: tokenListApi.getTokens(networkId),
      token,
      error: null,
    }
  }
  const error = `Token at address ${tokenAddress} could not be added to Exchange contract`
  logDebug('[services:addTokenToExchange]', error)

  return {
    success: false,
    tokenList: tokenListApi.getTokens(networkId),
    token,
    error,
  }
}
