import { useCallback, useEffect, useState } from 'react'

import { Order, getOrder, getTxOrders, RawOrder, GetOrderParams, GetTxOrdersParams } from 'api/operator'

import { transformOrder } from 'utils'

import { useNetworkId } from 'state/network'

import { useMultipleErc20 } from './useErc20'
import { Network } from 'types'
import { NETWORK_ID_SEARCH_LIST } from 'apps/explorer/const'

type UseOrderResult = {
  order: Order | null
  error?: string
  isLoading: boolean
  errorOrderPresentInNetworkId: Network | null
  forceUpdate?: () => void
}

interface GetOrderResult {
  order: RawOrder | null
  errorOrderPresentInNetworkId?: Network
}

type GetOrderParamsApi<T> = {
  [K in keyof T]: T[K]
}

interface GetOrderApiFn<T> {
  (params: GetOrderParamsApi<T>): Promise<RawOrder | null>
}

type GetOrderApi<T> = {
  api: GetOrderApiFn<T>
  defaultParams: GetOrderParamsApi<T>
}

type TypeOrderApiParams = GetOrderParams | GetTxOrdersParams

async function tryGetOrderOnAllNetworks(
  networkId: Network,
  getOrderApi: GetOrderApi<TypeOrderApiParams>,
  networkIdSearchListRemaining: Network[] = NETWORK_ID_SEARCH_LIST,
): Promise<GetOrderResult> {
  // Get order
  const order = await getOrderApi.api({ ...getOrderApi.defaultParams, networkId })

  if (order || networkIdSearchListRemaining.length === 0) {
    // We found the order in the right network
    // ...or we have no more networks in which to continue looking
    // so we return the "order" (can be null if it wasn't found in any network)
    return { order }
  }

  // If we didn't find the order in the current network, we look in different networks
  const [nextNetworkId, ...remainingNetworkIds] = networkIdSearchListRemaining.filter((network) => network != networkId)

  // Try to get the oder in another network (to see if the ID is OK, but the network not)
  const isOrderInDifferentNetwork = await getOrderApi
    .api({ ...getOrderApi.defaultParams, networkId: nextNetworkId })
    .then((order) => order !== null)

  console.log('is in different network', isOrderInDifferentNetwork)
  if (isOrderInDifferentNetwork) {
    // If the order exist in the other network
    return {
      order: null,
      errorOrderPresentInNetworkId: nextNetworkId,
    }
  } else {
    // Keep looking in other networks
    return tryGetOrderOnAllNetworks(nextNetworkId, getOrderApi, remainingNetworkIds)
  }
}

function _getOrder(networkId: Network, orderId: string): Promise<GetOrderResult> {
  const defaultParams: GetOrderParams = { networkId, orderId }
  const getOrderApi: GetOrderApi<GetOrderParams> = {
    api: (_defaultParams) => getOrder(_defaultParams),
    defaultParams,
  }

  return tryGetOrderOnAllNetworks(networkId, getOrderApi)
}

export function useOrderByNetwork(orderId: string, networkId: Network | null, updateInterval = 0): UseOrderResult {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [order, setOrder] = useState<Order | null>(null)
  const [errorOrderPresentInNetworkId, setErrorOrderPresentInNetworkId] = useState<Network | null>(null)
  // Hack to force component to update itself on demand
  const [forcedUpdate, setForcedUpdate] = useState({})
  const forceUpdate = useCallback((): void => setForcedUpdate({}), [])

  useEffect(() => {
    async function fetchOrder(): Promise<void> {
      if (!networkId) return

      setIsLoading(true)
      setError('')

      try {
        const { order: rawOrder, errorOrderPresentInNetworkId: errorOrderPresentInNetworkIdRaw } = await _getOrder(
          networkId,
          orderId,
        )
        console.log({ rawOrder, errorOrderPresentInNetworkIdRaw })
        if (rawOrder) {
          setOrder(transformOrder(rawOrder))
        }
        if (errorOrderPresentInNetworkIdRaw) {
          setErrorOrderPresentInNetworkId(errorOrderPresentInNetworkIdRaw)
        }
      } catch (e) {
        const msg = `Failed to fetch order: ${orderId}`
        console.error(msg, e.message)
        setError(msg)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [networkId, orderId, forcedUpdate])

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    // Only start the interval when:
    // 1. Hook is configured to do so (`updateInterval` > 0)
    // 2. Order exists
    // 3. Order is not expired
    if (updateInterval && order && order.expirationDate.getTime() > Date.now()) {
      intervalId = setInterval(forceUpdate, updateInterval)
    }

    return (): void => {
      intervalId && clearInterval(intervalId)
    }
  }, [forceUpdate, order, updateInterval])

  return { order, isLoading, error, errorOrderPresentInNetworkId, forceUpdate }
}

export function useOrder(orderId: string, updateInterval?: number): UseOrderResult {
  const networkId = useNetworkId()
  return useOrderByNetwork(orderId, networkId, updateInterval)
}

type UseOrderAndErc20sResult = {
  order: Order | null
  isLoading: boolean
  errors: Record<string, string>
  errorOrderPresentInNetworkId: Network | null
}

/**
 * Aggregates the fetching of the order and related erc20s
 * Optionally sets an interval of how often to update Open orders
 *
 * @param orderId The order id
 * @param updateInterval [Optional] How often should try to update the order
 */
export function useOrderAndErc20s(orderId: string, updateInterval = 0): UseOrderAndErc20sResult {
  const networkId = useNetworkId() || undefined

  const {
    order,
    isLoading: isOrderLoading,
    error: orderError,
    errorOrderPresentInNetworkId,
  } = useOrder(orderId, updateInterval)

  const addresses = order ? [order.buyTokenAddress, order.sellTokenAddress] : []

  const { value, isLoading: areErc20Loading, error: erc20Errors } = useMultipleErc20({ networkId, addresses })

  const errors = { ...erc20Errors }
  if (orderError) {
    errors[orderId] = orderError
  }

  if (order && value) {
    order.buyToken = value[order?.buyTokenAddress || '']
    order.sellToken = value[order?.sellTokenAddress || '']
  }

  return { order, isLoading: isOrderLoading || areErc20Loading, errors, errorOrderPresentInNetworkId }
}

function _getTxOrder(networkId: Network, txHash: string): Promise<GetOrderResult> {
  const defaultParams: GetTxOrdersParams = { networkId, txHash }
  const getOrderApi: GetOrderApi<GetTxOrdersParams> = {
    api: (_defaultParams) => getTxOrders(_defaultParams).then((orders) => orders[0] || null),
    defaultParams,
  }

  return tryGetOrderOnAllNetworks(networkId, getOrderApi)
}

export function useTxOrderByNetwork(txHash: string): UseOrderResult {
  const networkId = useNetworkId()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [order, setOrder] = useState<Order | null>(null)
  const [errorOrderPresentInNetworkId, setErrorOrderPresentInNetworkId] = useState<Network | null>(null)

  useEffect(() => {
    async function fetchOrder(): Promise<void> {
      if (!networkId) return

      setIsLoading(true)
      setError('')

      try {
        const { order: rawOrder, errorOrderPresentInNetworkId: errorOrderPresentInNetworkIdRaw } = await _getTxOrder(
          networkId,
          txHash,
        )
        console.log({ rawOrder, errorOrderPresentInNetworkIdRaw })
        if (rawOrder) {
          setOrder(transformOrder(rawOrder))
        }
        if (errorOrderPresentInNetworkIdRaw) {
          setErrorOrderPresentInNetworkId(errorOrderPresentInNetworkIdRaw)
        }
      } catch (e) {
        const msg = `Failed to fetch order of Tx: ${txHash}`
        console.error(msg, e.message)
        setError(msg)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [networkId, txHash])

  return { order, isLoading, error, errorOrderPresentInNetworkId }
}
