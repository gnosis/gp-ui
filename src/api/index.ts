import { Network } from 'types'
import { WalletApiMock } from './wallet/WalletApiMock'
import { WalletApiImpl, WalletApi } from './wallet/WalletApi'
import { TokenListApiImpl, TokenList } from './tokenList/TokenListApi'
import { TokenListApiMock } from './tokenList/TokenListApiMock'
import { Erc20Api, Erc20ApiDependencies } from './erc20/Erc20Api'
import { Erc20ApiMock } from './erc20/Erc20ApiMock'
import { Erc20ApiProxy } from './erc20/Erc20ApiProxy'
import { DepositApi, DepositApiDependencies } from './deposit/DepositApi'
import { DepositApiMock } from './deposit/DepositApiMock'
import { DepositApiProxy } from './deposit/DepositApiProxy'
import { ExchangeApi } from './exchange/ExchangeApi'
import { ExchangeApiMock } from './exchange/ExchangeApiMock'
import { ExchangeApiProxy } from './exchange/ExchangeApiProxy'
import { TheGraphApi } from './thegraph/TheGraphApi'
import { TheGraphApiProxy } from './thegraph/TheGraphApiProxy'
import { WethApi, WethApiImpl, WethApiDependencies } from './weth/WethApi'
import { WethApiMock } from './weth/WethApiMock'
import { DexPriceEstimatorApi } from './dexPriceEstimator/DexPriceEstimatorApi'
import { DexPriceEstimatorApiProxy } from './dexPriceEstimator/DexPriceEstimatorApiProxy'
import { TcrApi } from './tcr/TcrApi'
import { MultiTcrApiProxy } from './tcr/MultiTcrApiProxy'
import {
  tokenList,
  exchangeBalanceStates,
  erc20Balances,
  erc20Allowances,
  FEE_TOKEN,
  exchangeOrders,
  unregisteredTokens,
  TOKEN_8,
} from '../../test/data'
import Web3 from 'web3'
import { ETH_NODE_URL } from 'const'
// TODO connect to mainnet if we need AUTOCONNECT at all
export const getDefaultProvider = (): string | null => (process.env.NODE_ENV === 'test' ? null : ETH_NODE_URL)

export function createWeb3Api(): Web3 {
  // TODO: Create an `EthereumApi` https://github.com/gnosis/gp-v1-ui/issues/331
  const web3 = new Web3(getDefaultProvider())
  // `handleRevert = true` makes `require` failures to throw
  // For more details see https://github.com/gnosis/gp-v1-ui/issues/511
  web3.eth['handleRevert'] = true

  if (process.env.MOCK_WEB3 === 'true') {
    // Only function that needs to be mocked so far. We can add more and add extra logic as needed
    web3.eth.getCode = async (address: string): Promise<string> => address
  }
  return web3
}

export function createWalletApi(web3: Web3): WalletApi {
  let walletApi
  if (process.env.MOCK_WALLET === 'true') {
    walletApi = new WalletApiMock()
  } else {
    walletApi = new WalletApiImpl(web3)
  }
  window['walletApi'] = walletApi // register for convenience
  return walletApi
}

export function createErc20Api(injectedDependencies: Erc20ApiDependencies): Erc20Api {
  let erc20Api
  if (process.env.MOCK_ERC20 === 'true') {
    erc20Api = new Erc20ApiMock({ balances: erc20Balances, allowances: erc20Allowances, tokens: unregisteredTokens })
  } else {
    erc20Api = new Erc20ApiProxy(injectedDependencies)
  }
  window['erc20Api'] = erc20Api // register for convenience
  return erc20Api
}

export function createWethApi(injectedDependencies: WethApiDependencies): WethApi {
  let wethApi
  if (process.env.MOCK_WETH === 'true') {
    wethApi = new WethApiMock()
  } else {
    wethApi = new WethApiImpl(injectedDependencies)
  }
  window['wethApi'] = wethApi // register for convenience

  return wethApi
}

export function createDepositApi(erc20Api: Erc20Api, injectedDependencies: DepositApiDependencies): DepositApi {
  let depositApi
  if (process.env.MOCK_DEPOSIT === 'true') {
    depositApi = new DepositApiMock(exchangeBalanceStates, erc20Api)
  } else {
    depositApi = new DepositApiProxy(injectedDependencies)
  }
  window['depositApi'] = depositApi // register for convenience
  return depositApi
}

export function createExchangeApi(erc20Api: Erc20Api, injectedDependencies: DepositApiDependencies): ExchangeApi {
  let exchangeApi
  if (process.env.MOCK_EXCHANGE === 'true') {
    const tokens = [FEE_TOKEN, ...tokenList.map((token) => token.address), TOKEN_8]
    exchangeApi = new ExchangeApiMock({
      balanceStates: exchangeBalanceStates,
      erc20Api,
      registeredTokens: tokens,
      ordersByUser: exchangeOrders,
    })
  } else {
    exchangeApi = new ExchangeApiProxy({
      ...injectedDependencies,
      contractsDeploymentBlocks: CONFIG.exchangeContractConfig.config,
    })
  }
  window['exchangeApi'] = exchangeApi
  return exchangeApi
}

export function createTokenListApi(): TokenList {
  const networkIds = [Network.Mainnet, Network.Rinkeby, Network.xDAI]

  let tokenListApi: TokenList
  if (process.env.MOCK_TOKEN_LIST === 'true') {
    tokenListApi = new TokenListApiMock(tokenList)
  } else {
    tokenListApi = new TokenListApiImpl({ networkIds, initialTokenList: CONFIG.initialTokenList })
  }

  window['tokenListApi'] = tokenListApi // register for convenience
  return tokenListApi
}

export function createTheGraphApi(): TheGraphApi {
  const { type, config } = CONFIG.theGraphApi
  let theGraphApi: TheGraphApi
  switch (type) {
    case 'the-graph':
      theGraphApi = new TheGraphApiProxy(config)
      break

    default:
      throw new Error('Unknown implementation for TheGraphApi: ' + type)
  }

  window['theGraphApi'] = theGraphApi
  return theGraphApi
}

export function createDexPriceEstimatorApi(): DexPriceEstimatorApi {
  const { type, config } = CONFIG.dexPriceEstimator
  let dexPriceEstimatorApi: DexPriceEstimatorApi
  switch (type) {
    case 'dex-price-estimator':
      dexPriceEstimatorApi = new DexPriceEstimatorApiProxy(config)
      break

    default:
      throw new Error('Unknown implementation for DexPriceEstimatorApi: ' + type)
  }

  window['dexPriceEstimatorApi'] = dexPriceEstimatorApi
  return dexPriceEstimatorApi
}

export function createTcrApi(web3: Web3): TcrApi | undefined {
  const { type } = CONFIG.tcr
  let tcrApi: TcrApi | undefined
  switch (CONFIG.tcr.type) {
    case 'none':
      tcrApi = undefined
      break
    case 'multi-tcr': {
      const multiTcrApiConfig = CONFIG.tcr
      tcrApi = new MultiTcrApiProxy({ web3, ...multiTcrApiConfig.config })
      break
    }

    default:
      throw new Error('Unknown implementation for DexPriceEstimatorApi: ' + type)
  }

  window['tcrApi'] = tcrApi
  return tcrApi
}

export const web3 = createWeb3Api()
export const walletApi = createWalletApi(web3)
