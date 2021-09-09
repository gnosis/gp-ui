import React, { useMemo } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { media } from 'theme/styles/media'

import ExplorerTabs from 'apps/explorer/components/common/ExplorerTabs/ExplorerTab'
import { OrdersTableWithData } from './OrdersTableWithData'
import { OrdersTableContext, OrdersTableState } from './context/OrdersTableContext'
import { useGetOrders } from './useGetOrders'
import { TabItemInterface } from 'components/common/Tabs/Tabs'

const Wrapper = styled.div`
  padding: 1.6rem;
  margin: 0 auto;
  width: 100%;
  max-width: 140rem;

  ${media.mediumDown} {
    max-width: 94rem;
  }

  ${media.mobile} {
    max-width: 100%;
  }
`

const StyledTabLoader = styled.span`
  padding-left: 4px;
`

const tabItems = (ordersTableState: OrdersTableState): TabItemInterface[] => {
  return [
    {
      id: 1,
      tab: (
        <>
          Orders
          <StyledTabLoader>
            {ordersTableState === OrdersTableState.Loading && <FontAwesomeIcon icon={faSpinner} spin size="1x" />}
          </StyledTabLoader>
        </>
      ),
      content: <OrdersTableWithData />,
    },
    {
      id: 2,
      tab: 'Trades',
      content: (
        <>
          <h2>Trades Content</h2>
        </>
      ),
    },
  ]
}

function useAddressParam(): string {
  const { address } = useParams<{ address: string }>()

  return address
}

const OrdersTableWidget: React.FC = () => {
  const ownerAddress = useAddressParam()
  const { orders, isLoading, error } = useGetOrders(ownerAddress)
  const ordersTableState = useMemo(() => {
    if (isLoading && orders.length === 0) return OrdersTableState.Loading
    else if (error) return OrdersTableState.Error

    return OrdersTableState.Loaded
  }, [isLoading, orders.length, error])

  return (
    <OrdersTableContext.Provider value={{ orders, kind: ordersTableState, error }}>
      <Wrapper>
        <ExplorerTabs tabItems={tabItems(isLoading ? OrdersTableState.Loading : OrdersTableState.Loaded)} />
      </Wrapper>
    </OrdersTableContext.Provider>
  )
}

export default OrdersTableWidget
