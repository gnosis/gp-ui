import { useEffect } from 'react'
import BN from 'bn.js'
import { assert } from '@gnosis.pm/dex-js'

import { erc20Api, depositApi } from 'apps/gp-v1/api'

import useSafeState from './useSafeState'
import { useWalletConnection } from './useWalletConnection'

import { formatSmart, logDebug, isTokenEnabled, timeout, notEmpty } from 'utils'
import { TokenBalanceDetails, TokenDetails } from 'types'
import { WalletInfo } from 'api/wallet/WalletApi'
import { PendingFlux } from 'api/deposit/DepositApi'
import { useTokenList, UseTokenListParams } from './useTokenList'

interface UseBalanceResult {
  balances: TokenBalanceDetails[]
  tokens: TokenDetails[]
  error: boolean
}

function calculateTotalBalance(balance: BN, currentBatchId: number, pendingDeposit: PendingFlux): BN {
  const { amount, batchId } = pendingDeposit
  // Only matured deposits are added to the balance:
  // https://github.com/gnosis/dex-contracts/blob/master/contracts/EpochTokenLocker.sol#L165
  // In the UI we always display the pending amount as part of user's balance
  return batchId >= currentBatchId ? balance.add(amount) : balance
}

async function fetchBalancesForToken(
  token: TokenDetails,
  userAddress: string,
  contractAddress: string,
  networkId: number,
): Promise<TokenBalanceDetails> {
  const tokenAddress = token.address

  const [exchangeBalance, pendingDeposit, pendingWithdraw, currentBatchId, walletBalance, allowance] =
    await Promise.all([
      depositApi.getBalance({ userAddress, tokenAddress, networkId }),
      depositApi.getPendingDeposit({ userAddress, tokenAddress, networkId }),
      depositApi.getPendingWithdraw({ userAddress, tokenAddress, networkId }),
      depositApi.getCurrentBatchId(networkId),
      erc20Api.balanceOf({ userAddress, tokenAddress, networkId }),
      erc20Api.allowance({ userAddress, tokenAddress, networkId, spenderAddress: contractAddress }),
    ])

  return {
    ...token,
    decimals: token.decimals,
    exchangeBalance,
    totalExchangeBalance: calculateTotalBalance(exchangeBalance, currentBatchId, pendingDeposit),
    pendingDeposit,
    pendingWithdraw,
    claimable: pendingWithdraw.amount.isZero() ? false : pendingWithdraw.batchId < currentBatchId,
    walletBalance,
    enabled: isTokenEnabled(allowance, token),
  }
}

const balanceCache: { [K: string]: TokenBalanceDetails } = {}
interface CacheKeyParams {
  token: TokenDetails
  userAddress: string
  contractAddress: string
  networkId: number
}
const constructCacheKey = ({ token, userAddress, contractAddress, networkId }: CacheKeyParams): string => {
  return token.address + '|' + userAddress + '|' + contractAddress + '|' + networkId
}

async function _getBalances(walletInfo: WalletInfo, tokens: TokenDetails[]): Promise<TokenBalanceDetails[]> {
  const { userAddress, networkId } = walletInfo
  if (!userAddress || !networkId || tokens.length === 0) {
    return []
  }

  const contractAddress = depositApi.getContractAddress(networkId)
  assert(contractAddress, 'No valid contract address found. Stopping.')

  const balancePromises: Promise<TokenBalanceDetails | null>[] = tokens.map((token) => {
    const cacheKey = constructCacheKey({ token, userAddress, contractAddress, networkId })

    // timoutPromise == Promise<never>, correctly determined to always throw
    const timeoutPromise = timeout({
      timeoutErrorMsg: 'Timeout fetching balances for ' + token.address,
    })

    const fetchBalancesPromise = fetchBalancesForToken(token, userAddress, contractAddress, networkId).then(
      (balance) => {
        balanceCache[cacheKey] = balance
        return balance
      },
    )

    // balancePromise == Promise<TokenBalanceDetails | never> == Promise<TokenBalanceDetails> or throws
    const balancePromise = Promise.race([fetchBalancesPromise, timeoutPromise])

    return balancePromise.catch((e) => {
      console.error('[useTokenBalances] Error for', token, userAddress, contractAddress, e)
      const cachedValue = balanceCache[cacheKey]
      if (cachedValue) {
        logDebug('Using cached value for', token, userAddress, contractAddress)
        return cachedValue
      }

      return null
    })
  })

  const balances = await Promise.all(balancePromises)

  // TODO: Would be better to show the errored tokens in error state
  return balances.filter(notEmpty)
}

export const useTokenBalances = (passOnParams: Partial<UseTokenListParams> = {}): UseBalanceResult => {
  const walletInfo = useWalletConnection()
  const [balances, setBalances] = useSafeState<TokenBalanceDetails[]>([])
  const [error, setError] = useSafeState(false)

  // get all tokens, maybe without deprecated
  const { tokens } = useTokenList({ networkId: walletInfo.networkId, ...passOnParams })

  // Get token balances
  useEffect(() => {
    if (walletInfo.isConnected) {
      _getBalances(walletInfo, tokens)
        .then((balances) => {
          logDebug(
            '[useTokenBalances] Wallet balances',
            balances ? balances.map((b) => formatSmart(b.walletBalance, b.decimals)) : null,
          )
          setBalances(balances)
          setError(false)
        })
        .catch((error) => {
          console.error('[useTokenBalances] Error loading token balances', error)
          setError(true)
        })
    }
  }, [setBalances, setError, walletInfo, tokens])

  return { balances, error, tokens }
}
