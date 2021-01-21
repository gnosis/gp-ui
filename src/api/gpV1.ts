import {
  createDepositApi,
  createDexPriceEstimatorApi,
  createErc20Api,
  createExchangeApi,
  createTcrApi,
  createTheGraphApi,
  createTokenListApi,
  createWalletApi,
  createWeb3Api,
  createWethApi,
} from 'api'

// Build APIs
export const web3 = createWeb3Api()
export const walletApi = createWalletApi(web3)

const injectedDependencies = { web3 }

export const erc20Api = createErc20Api(injectedDependencies)
export const wethApi = createWethApi(injectedDependencies)
export const depositApi = createDepositApi(erc20Api, injectedDependencies)
export const exchangeApi = createExchangeApi(erc20Api, injectedDependencies)
export const tokenListApi = createTokenListApi()
export const theGraphApi = createTheGraphApi()
export const dexPriceEstimatorApi = createDexPriceEstimatorApi()
export const tcrApi = createTcrApi(web3)
