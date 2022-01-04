import React from 'react'

import { TitleAddress } from 'apps/explorer/pages/styled'
import { useGetTxOrders } from 'hooks/useGetOrders'
import RedirectToSearch from 'components/RedirectToSearch'
import Spinner from 'components/common/Spinner'
import { BlockExplorerLink } from 'components/common/BlockExplorerLink'
import { RedirectToNetwork, useNetworkId } from 'state/network'

interface Props {
  txHash: string
}

export const TransactionsTableWidget: React.FC<Props> = ({ txHash }) => {
  const { orders, isLoading: isTxLoading, errorTxPresentInNetworkId } = useGetTxOrders(txHash)
  const networkId = useNetworkId() || undefined

  if (errorTxPresentInNetworkId && networkId != errorTxPresentInNetworkId) {
    return <RedirectToNetwork networkId={errorTxPresentInNetworkId} />
  }

  if (!isTxLoading && orders && orders.length < 1) {
    return <RedirectToSearch from="tx" />
  }

  if (!orders) {
    return <Spinner spin size="3x" />
  }

  // TODO replace with a real table component
  return (
    <>
      <h1>
        Transaction details
        <TitleAddress
          textToCopy={txHash}
          contentsToDisplay={<BlockExplorerLink type="tx" networkId={networkId} identifier={txHash} />}
        />
      </h1>
      <h2>{orders.length} Tx found.</h2>
    </>
  )
}
