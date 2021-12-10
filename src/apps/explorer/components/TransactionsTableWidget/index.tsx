import React, { useCallback, useEffect, useState } from 'react'

import { Network } from 'types'
import { getTxOrders, Order } from 'api/operator'
import { BlockchainNetwork } from '../OrdersTableWidget/context/OrdersTableContext'
import { useMultipleErc20 } from 'hooks/useErc20'
import { useNetworkId } from 'state/network'
import { transformOrder } from 'utils'

function isObjectEmpty(object: Record<string, unknown>): boolean {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  for (const key in object) {
    if (key) return false
  }

  return true
}

type Result = {
  orders: Order[] | undefined
  error: string
  isLoading: boolean
}

export function useGetTxOrders(txHash: string): Result {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [orders, setOrders] = useState<Order[] | undefined>()
  const networkId = useNetworkId() || undefined
  const [erc20Addresses, setErc20Addresses] = useState<string[]>([])
  const { value: valueErc20s, isLoading: areErc20Loading } = useMultipleErc20({ networkId, addresses: erc20Addresses })
  const [mountNewOrders, setMountNewOrders] = useState(false)

  useEffect(() => {
    setOrders(undefined)
    setMountNewOrders(false)
  }, [networkId])

  const fetchOrders = useCallback(async (network: Network, _txHash: string): Promise<void> => {
    setIsLoading(true)
    setError('')

    try {
      const ordersFetched = await getTxOrders({ networkId: network, txHash: _txHash })
      const newErc20Addresses = ordersFetched.reduce((accumulator: string[], element) => {
        const updateAccumulator = (tokenAddress: string): void => {
          if (accumulator.indexOf(tokenAddress) === -1) {
            accumulator.push(tokenAddress)
          }
        }
        updateAccumulator(element.buyToken)
        updateAccumulator(element.sellToken)

        return accumulator
      }, [])

      setErc20Addresses(newErc20Addresses)

      setOrders(ordersFetched.map((order) => transformOrder(order)))
      setMountNewOrders(true)
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

    fetchOrders(networkId, txHash)
  }, [fetchOrders, networkId, txHash])

  useEffect(() => {
    if (!orders || areErc20Loading || isObjectEmpty(valueErc20s) || !mountNewOrders) {
      return
    }

    const newOrders = orders.map((order) => {
      order.buyToken = valueErc20s[order.buyTokenAddress] || order.buyToken
      order.sellToken = valueErc20s[order.sellTokenAddress] || order.sellToken

      return order
    })

    setOrders(newOrders)
    setMountNewOrders(false)
    setErc20Addresses([])
  }, [valueErc20s, networkId, areErc20Loading, mountNewOrders, orders])

  return { orders, error, isLoading }
}

interface Props {
  txHash: string
  networkId: BlockchainNetwork
}

export const TransactionsTableWidget: React.FC<Props> = ({ txHash }) => {
  const { orders, isLoading: isTxLoading } = useGetTxOrders(txHash)

  return isTxLoading ? <h2>Loading</h2> : <h2>{orders ? orders.length : '0'}</h2>
}
