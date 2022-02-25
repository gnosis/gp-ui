import { useState, useCallback, useEffect } from 'react'

import { Network } from 'types'
import { fetchTradesAccounts, getTradesAndTransfers, Trade, Transfer, Account } from 'api/tenderly'

interface TxBatchTrades {
  trades: Trade[]
  transfers: Transfer[]
}

type Accounts = { [k: string]: Account } | undefined

type GetTxBatchTradesResult = {
  txBatchTrades: TxBatchTrades
  accounts: Accounts
  error: string
  isLoading: boolean
}

export function useTxBatchTrades(networkId: Network | undefined, txHash: string): GetTxBatchTradesResult {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [txBatchTrades, setTxBatchTrades] = useState<TxBatchTrades>({ trades: [], transfers: [] })
  const [accounts, setAccounts] = useState<Accounts>()

  const _fetchTxTrades = useCallback(async (network: Network, _txHash: string): Promise<void> => {
    setIsLoading(true)
    setError('')

    try {
      const { transfers, trades } = await getTradesAndTransfers(network, _txHash)
      const _accounts = Object.fromEntries(await fetchTradesAccounts(network, _txHash, trades, transfers))

      setTxBatchTrades({ trades, transfers })
      setAccounts(_accounts)
    } catch (e) {
      const msg = `Failed to fetch tx orders`
      console.error(msg, e)
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!networkId) {
      return
    }

    _fetchTxTrades(networkId, txHash)
  }, [_fetchTxTrades, networkId, txHash])

  return { txBatchTrades, accounts, error, isLoading: isLoading }
}
