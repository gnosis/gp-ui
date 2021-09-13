import React, { useMemo } from 'react'
import styled from 'styled-components'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { media } from 'theme/styles/media'

import ExplorerTabs from 'apps/explorer/components/common/ExplorerTabs/ExplorerTab'
import { OrdersTableWithData } from './OrdersTableWithData'
import { OrdersTableContext, OrdersTableState } from './context/OrdersTableContext'
import { useGetOrders } from './useGetOrders'
import { TabItemInterface } from 'components/common/Tabs/Tabs'
import { RowWithCopyButton } from 'components/common/RowWithCopyButton'

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
  > h1 {
    display: flex;
    padding: 2.4rem 0 3rem;
    align-items: center;
    font-weight: ${({ theme }): string => theme.fontBold};
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

const TitleAddress = styled(RowWithCopyButton)`
  color: ${({ theme }): string => theme.grey};
  font-size: ${({ theme }): string => theme.fontSizeDefault};
  font-weight: ${({ theme }): string => theme.fontNormal};
  margin: 0 0 0 1rem;
  display: flex;
  align-items: center;
`

interface Props {
  ownerAddress: string
}

const OrdersTableWidget: React.FC<Props> = ({ ownerAddress }) => {
  const { orders, isLoading, error } = useGetOrders(ownerAddress)
  const ordersTableState = useMemo(() => {
    if (isLoading && orders.length === 0) return OrdersTableState.Loading
    else if (error) return OrdersTableState.Error

    return OrdersTableState.Loaded
  }, [isLoading, orders.length, error])

  return (
    <OrdersTableContext.Provider value={{ orders, kind: ordersTableState, error }}>
      <Wrapper>
        <h1>
          User details
          {<TitleAddress textToCopy={ownerAddress} contentsToDisplay={ownerAddress} />}
        </h1>
        <ExplorerTabs tabItems={tabItems(isLoading ? OrdersTableState.Loading : OrdersTableState.Loaded)} />
      </Wrapper>
    </OrdersTableContext.Provider>
  )
}

export default OrdersTableWidget
