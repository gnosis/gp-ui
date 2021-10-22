import React, { useCallback, useState, useEffect } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { BlockchainNetwork } from './context/OrdersTableContext'
import { Network } from 'types'
import { Order, getAccountOrders } from 'api/operator'
import Spinner from 'components/common/Spinner'

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  height: 100%;

  > section {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    p {
      margin-top: 0;
    }
  }

  ul {
    padding: 0 0.8rem 0 0;
    margin: 0;
    > li {
      list-style: none;
      padding-bottom: 1.5rem;
      :last-child {
        padding-bottom: 0;
      }
    }
  }
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
  const isOrdersUndefined = typeof orders === 'undefined'

  const renderMessageElement = useCallback(() => {
    if (!networkId) return <Spinner />

    const _renderMessage = (): string | React.ReactNode => `No orders in ${Network[networkId]} network.`
    const areOtherNetworks = ordersInNetworks.length > 0

    return (
      <Wrapper>
        <p>
          <strong>{_renderMessage()}</strong>
        </p>
        {areOtherNetworks && (
          <section>
            {' '}
            <p>But have been detected in:</p>
            {
              <ul>
                {ordersInNetworks.map((e) => (
                  <li key={e.network}>
                    <Link to={`/${e.network.toLowerCase()}/address/${ownerAddress}`}>{e.network}</Link>
                  </li>
                ))}
              </ul>
            }
          </section>
        )}
      </Wrapper>
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
    if (!networkId || isOrdersUndefined) return

    fetchAnotherNetworks(networkId)
  }, [fetchAnotherNetworks, isOrdersUndefined, networkId])

  return renderMessageElement()
}
