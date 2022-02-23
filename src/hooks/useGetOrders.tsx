import { useState, useEffect, useCallback } from 'react'

import { Network } from 'types'
import { useMultipleErc20 } from 'hooks/useErc20'
import { updateWeb3Provider } from 'api/web3'
import { web3 } from 'apps/explorer/api'
import { getAccountOrders, getTxOrders, Order } from 'api/operator'
import { GetTxOrdersParams, RawOrder } from 'api/operator/types'
import { useNetworkId } from 'state/network'
import { transformOrder } from 'utils'
import { ORDERS_QUERY_INTERVAL, NETWORK_ID_SEARCH_LIST } from 'apps/explorer/const'
import { Props as ExplorerLinkProps } from 'components/common/BlockExplorerLink'
import {
  GetOrderResult,
  MultipleOrders,
  GetOrderApi,
  tryGetOrderOnAllNetworks,
} from 'services/helpers/tryGetOrderOnAllNetworks'

function isObjectEmpty(object: Record<string, unknown>): boolean {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  for (const key in object) {
    if (key) return false
  }

  return true
}

function filterDuplicateErc20Addresses(ordersFetched: RawOrder[]): string[] {
  return ordersFetched.reduce((accumulator: string[], element) => {
    const updateAccumulator = (tokenAddress: string): void => {
      if (accumulator.indexOf(tokenAddress) === -1) {
        accumulator.push(tokenAddress)
      }
    }
    updateAccumulator(element.buyToken)
    updateAccumulator(element.sellToken)

    return accumulator
  }, [])
}

type Result = {
  orders: Order[] | undefined
  error: string
  isLoading: boolean
}

type GetAccountOrdersResult = Result & {
  isThereNext: boolean
}

type GetTxOrdersResult = Result & {
  errorTxPresentInNetworkId: Network | null
}

interface UseOrdersWithTokenInfo {
  orders: Order[] | undefined
  areErc20Loading: boolean
  setOrders: (value: Order[] | undefined) => void
  setMountNewOrders: (value: boolean) => void
  setErc20Addresses: (value: string[]) => void
}

export function getTxOrderOnEveryNetwork(networkId: Network, txHash: string): Promise<GetOrderResult<MultipleOrders>> {
  const defaultParams: GetTxOrdersParams = { networkId, txHash }
  const getOrderApi: GetOrderApi<GetTxOrdersParams, MultipleOrders> = {
    api: (_defaultParams) => getTxOrders(_defaultParams).then((orders) => (orders.length ? orders : null)),
    defaultParams,
  }

  return tryGetOrderOnAllNetworks(networkId, getOrderApi)
}

function useOrdersWithTokenInfo(networkId: Network | undefined): UseOrdersWithTokenInfo {
  const [orders, setOrders] = useState<Order[] | undefined>()
  const [erc20Addresses, setErc20Addresses] = useState<string[]>([])
  const { value: valueErc20s, isLoading: areErc20Loading } = useMultipleErc20({ networkId, addresses: erc20Addresses })
  const [mountNewOrders, setMountNewOrders] = useState(false)

  useEffect(() => {
    setOrders(undefined)
    setMountNewOrders(false)
  }, [networkId])

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

  return { orders, areErc20Loading, setOrders, setMountNewOrders, setErc20Addresses }
}

export function useGetTxOrders(txHash: string): GetTxOrdersResult {
  const networkId = useNetworkId() || undefined
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { orders, areErc20Loading, setOrders, setMountNewOrders, setErc20Addresses } = useOrdersWithTokenInfo(networkId)
  const [errorTxPresentInNetworkId, setErrorTxPresentInNetworkId] = useState<Network | null>(null)

  const fetchOrders = useCallback(
    async (network: Network, _txHash: string): Promise<void> => {
      setIsLoading(true)
      setError('')

      try {
        const { order: _orders, errorOrderPresentInNetworkId: errorTxPresentInNetworkIdRaw } =
          await getTxOrderOnEveryNetwork(network, _txHash)
        const ordersFetched = _orders || []
        const newErc20Addresses = filterDuplicateErc20Addresses(ordersFetched)

        setErc20Addresses(newErc20Addresses)

        setOrders(ordersFetched.map((order) => transformOrder(order)))
        setMountNewOrders(true)

        if (errorTxPresentInNetworkIdRaw) {
          console.log({ _orders, errorTxPresentInNetworkIdRaw })
          setErrorTxPresentInNetworkId(errorTxPresentInNetworkIdRaw)
        }
      } catch (e) {
        const msg = `Failed to fetch tx orders`
        console.error(msg, e)
        setError(msg)
      } finally {
        setIsLoading(false)
      }
    },
    [setErc20Addresses, setMountNewOrders, setOrders],
  )

  useEffect(() => {
    if (!networkId) {
      return
    }

    fetchOrders(networkId, txHash)
  }, [fetchOrders, networkId, txHash])

  return { orders, error, isLoading: isLoading || areErc20Loading, errorTxPresentInNetworkId }
}

export function useTxOrderExplorerLink(
  txHash: string,
  orders: Order[] | undefined,
): ExplorerLinkProps | Record<string, unknown> {
  const networkId = useNetworkId() || undefined
  const [explorerLink, setExplorerLink] = useState<ExplorerLinkProps | Record<string, unknown>>({})

  useEffect(() => {
    if (!networkId) {
      return
    }

    if (!orders?.length) {
      for (const network of NETWORK_ID_SEARCH_LIST) {
        //update provider to find tx in network
        updateWeb3Provider(web3, network)
        web3.eth.getTransaction(txHash).then((tx) => {
          if (tx) {
            setExplorerLink({
              type: 'tx',
              networkId: network,
              identifier: txHash,
              showLogo: network !== Network.xDAI,
              label: network === Network.xDAI ? 'Blockscout' : 'Etherscan',
            })
          }
        })
        if (Object.keys(explorerLink).length > 0) break
      }
      // reset provider
      updateWeb3Provider(web3, networkId)
    }
  }, [explorerLink, networkId, orders, txHash])

  return explorerLink
}

export function useGetAccountOrders(
  ownerAddress: string,
  limit = 1000,
  offset = 0,
  pageIndex?: number,
): GetAccountOrdersResult {
  const networkId = useNetworkId() || undefined
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { orders, setOrders, setMountNewOrders, setErc20Addresses } = useOrdersWithTokenInfo(networkId)
  const [isThereNext, setIsThereNext] = useState(false)

  const fetchOrders = useCallback(
    async (network: Network, owner: string): Promise<void> => {
      setIsLoading(true)
      setError('')
      const limitPlusOne = limit + 1

      try {
        const ordersFetched = await getAccountOrders({ networkId: network, owner, offset, limit: limitPlusOne })
        if (ordersFetched.length === limitPlusOne) {
          setIsThereNext(true)
          ordersFetched.pop()
        }
        const newErc20Addresses = filterDuplicateErc20Addresses(ordersFetched)
        setErc20Addresses(newErc20Addresses)

        setOrders(ordersFetched.map((order) => transformOrder(order)))
        setMountNewOrders(true)
      } catch (e) {
        const msg = `Failed to fetch orders`
        console.error(msg, e)
        setError(msg)
      } finally {
        setIsLoading(false)
      }
    },
    [limit, offset, setErc20Addresses, setMountNewOrders, setOrders],
  )

  useEffect(() => {
    if (!networkId) {
      return
    }

    setIsThereNext(false)
    fetchOrders(networkId, ownerAddress)

    if (pageIndex && pageIndex > 1) return

    const intervalId: NodeJS.Timeout = setInterval(() => {
      fetchOrders(networkId, ownerAddress)
    }, ORDERS_QUERY_INTERVAL)

    return (): void => {
      clearInterval(intervalId)
    }
  }, [fetchOrders, networkId, ownerAddress, pageIndex])

  return { orders, error, isLoading, isThereNext }
}
