import React, { useCallback, useState, useEffect } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { BlockchainNetwork } from './context/OrdersTableContext'
import { Network } from 'types'
import { Order, getAccountOrders } from 'api/operator'

const Wrapper = styled.span`
  display: flex;
`

interface OrdersInNetwork {
  network: string
  count: number
}

export const useSearchInAnotherNetwork = (
  networkId: BlockchainNetwork,
  ownerAddress: string,
  orders: Order[] | undefined,
): string | React.ReactNode => {
  const [ordersInNetworks, setOrdersInNetworks] = useState<OrdersInNetwork[]>([])

  const renderMessageElement = useCallback(() => {
    const _renderMessage = (): string => (networkId ? `No orders in ${Network[networkId]} network.` : 'No orders.')
    const areOtherNetworks = ordersInNetworks.length > 0

    return (
      <>
        <p>{_renderMessage()}</p>
        {areOtherNetworks && (
          <Wrapper>
            {' '}
            But have been detected in:
            {
              <ul>
                {ordersInNetworks.map((e) => (
                  <li key={e.network}>
                    <Link to={`/${e.network.toLowerCase()}/address/${ownerAddress}`}>{e.network}</Link>
                  </li>
                ))}
              </ul>
            }
          </Wrapper>
        )}
      </>
    )
  }, [networkId, ordersInNetworks, ownerAddress])

  const fetchAnotherNetworks = useCallback(
    async (_networkId: Network) => {
      const NetworkList = [Network.Mainnet, Network.xDAI, Network.Rinkeby]

      const promises = NetworkList.filter((net) => net !== _networkId).map((network) =>
        getAccountOrders({ networkId: network, owner: ownerAddress, offset: 0, limit: 1 })
          .then((response) => {
            return { network: Network[network], count: response.length }
          })
          .catch(() => {
            throw new Error(`Failed to fetch order in ${Network[_networkId]}`)
          }),
      )

      try {
        const networksHaveOrders = (await Promise.allSettled(promises)).filter(
          (e) => e.status === 'fulfilled' && e.value.count,
        )
        setOrdersInNetworks(networksHaveOrders.map((e: PromiseFulfilledResult<OrdersInNetwork>) => e.value))
      } catch (e) {
        console.error(e.message)
      }
    },
    [ownerAddress],
  )

  useEffect(() => {
    if (!networkId || !orders) return

    fetchAnotherNetworks(networkId)
  }, [fetchAnotherNetworks, networkId, orders])

  return renderMessageElement()
}
