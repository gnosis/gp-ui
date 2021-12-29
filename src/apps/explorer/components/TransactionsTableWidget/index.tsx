import React from 'react'

import { BlockchainNetwork, TransactionsTableContext } from './context/TransactionsTableContext'
import { StyledUserDetailsTableProps } from 'components/common/StyledUserDetailsTable'
import styled from 'styled-components'
import { useGetTxOrders } from 'hooks/useGetOrders'
import ExplorerTabs from 'apps/explorer/components/common/ExplorerTabs/ExplorerTab'
import { TabItemInterface } from 'components/common/Tabs/Tabs'
import Spinner from 'components/common/Spinner'
import { TransactionsTableWithData } from 'apps/explorer/components/TransactionsTableWidget/TransactionsTableWithData'
import { Order } from 'api/operator'

export type Props = StyledUserDetailsTableProps & {
  txHash: string
  networkId: BlockchainNetwork
  transactions?: Order[]
}

const StyledTabLoader = styled.span`
  padding-left: 4px;
`

const tabItems = (isLoadingOrders: boolean): TabItemInterface[] => {
  return [
    {
      id: 1,
      tab: (
        <>
          Transactions
          <StyledTabLoader>{isLoadingOrders && <Spinner spin size="1x" />}</StyledTabLoader>
        </>
      ),
      content: <TransactionsTableWithData />,
    },
  ]
}

export const TransactionsTableWidget: React.FC<Props> = ({ txHash, networkId }) => {
  const { orders, isLoading: isOrdersLoading, error } = useGetTxOrders(txHash)
  const txHashParams = { networkId, txHash }

  console.log('TransactionsTableWidget orders', orders, typeof orders)
  return (
    <TransactionsTableContext.Provider
      value={{
        orders,
        txHashParams,
        error,
        isOrdersLoading,
      }}
    >
      <ExplorerTabs tabItems={tabItems(isOrdersLoading)} />
    </TransactionsTableContext.Provider>
  )
}
