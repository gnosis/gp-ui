import { useEffect, useState } from 'react'

import { TokenErc20 } from '@gnosis.pm/dex-js'

import { Order, transformOrder } from 'api/operator'
import { getOrder } from 'api/operator/operatorApi'

import { useNetworkId } from 'state/network'
import { useMultipleErc20 } from './useErc20'

export function useOrder(orderId: string): { order: Order | null; error?: string; isLoading: boolean } {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [order, setOrder] = useState<Order | null>(null)

  const networkId = useNetworkId()

  useEffect(() => {
    async function fetchOrder(): Promise<void> {
      if (!networkId) return

      setIsLoading(true)
      setError('')

      try {
        const rawOrder = await getOrder({ networkId, orderId })
        if (rawOrder) {
          setOrder(transformOrder(rawOrder))
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
  }, [networkId, orderId])

  return { order, isLoading, error }
}

type Result = {
  order: Order | null
  buyToken: TokenErc20 | null
  sellToken: TokenErc20 | null
  isLoading: boolean
  error?: string
}

/**
 * Aggregates the fetching of the order and related erc20s
 *
 * @param orderId The order id
 */
export function useOrderAndErc20s(orderId: string): Result {
  const networkId = useNetworkId() || undefined

  const { order, isLoading: isOrderLoading, error: orderError } = useOrder(orderId)
  const addresses = order ? [order.buyTokenAddress, order.sellTokenAddress] : []

  // TODO: consume errors obj
  const { value, isLoading: areErc20Loading /*, error: erc20Errors*/ } = useMultipleErc20({ networkId, addresses })

  const buyToken = value && value[order?.buyTokenAddress || '']
  const sellToken = value && value[order?.sellTokenAddress || '']

  return { order, buyToken, sellToken, isLoading: isOrderLoading || areErc20Loading, error: orderError }
}
