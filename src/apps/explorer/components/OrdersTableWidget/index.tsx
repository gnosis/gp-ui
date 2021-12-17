import React from 'react'
import styled from 'styled-components'

import ExplorerTabs from 'apps/explorer/components/common/ExplorerTabs/ExplorerTab'
import { useGetOrders } from './useGetOrders'
import { TabItemInterface } from 'components/common/Tabs/Tabs'
import { useTable } from './useTable'
import { OrdersTableWithData } from './OrdersTableWithData'
import { OrdersTableContext, BlockchainNetwork } from './context/OrdersTableContext'
import PaginationOrdersTable from './PaginationOrdersTable'
import Spinner from 'components/common/Spinner'

const StyledTabLoader = styled.span`
  padding-left: 4px;
`

const tabItems = (isLoadingOrders: boolean): TabItemInterface[] => {
  return [
    {
      id: 1,
      tab: (
        <>
          Orders
          <StyledTabLoader>{isLoadingOrders && <Spinner spin size="1x" />}</StyledTabLoader>
        </>
      ),
      content: <OrdersTableWithData />,
    },
  ]
}

const WrapperExtraComponents = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-end;
  height: 100%;
`

const ExtraComponentNode: React.ReactNode = (
  <WrapperExtraComponents>
    <PaginationOrdersTable />
  </WrapperExtraComponents>
)
interface Props {
  ownerAddress: string
  networkId: BlockchainNetwork
}

const OrdersTableWidget: React.FC<Props> = ({ ownerAddress, networkId }) => {
  const {
    state: tableState,
    setPageSize,
    handleNextPage,
    handlePreviousPage,
  } = useTable({ initialState: { pageOffset: 0, pageSize: 20 } })
  const {
    orders,
    isLoading: isOrdersLoading,
    error,
    isThereNext: isThereNextOrder,
  } = useGetOrders(ownerAddress, tableState.pageSize, tableState.pageOffset, tableState.pageIndex)
  tableState['hasNextPage'] = isThereNextOrder
  const addressAccountParams = { ownerAddress, networkId }

  return (
    <OrdersTableContext.Provider
      value={{
        addressAccountParams,
        orders,
        error,
        isOrdersLoading,
        tableState,
        setPageSize,
        handleNextPage,
        handlePreviousPage,
      }}
    >
      <ExplorerTabs tabItems={tabItems(isOrdersLoading)} extra={ExtraComponentNode} />
    </OrdersTableContext.Provider>
  )
}

export default OrdersTableWidget
