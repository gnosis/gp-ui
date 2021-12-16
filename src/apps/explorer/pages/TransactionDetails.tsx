import React from 'react'
import { useParams } from 'react-router'

import { useNetworkId } from 'state/network'
import { BlockExplorerLink } from 'components/common/BlockExplorerLink'
import { TitleAddress, Wrapper } from 'apps/explorer/pages/styled'
import OrdersTableWidget from 'apps/explorer/components/OrdersTableWidget'

const TransactionDetails: React.FC = () => {
  const { address } = useParams<{ address: string }>()
  const networkId = useNetworkId() || undefined

  return (
    <Wrapper>
      <h1>
        Transaction details
        <TitleAddress
          textToCopy={address}
          contentsToDisplay={<BlockExplorerLink type="tx" networkId={networkId} identifier={address} />}
        />
      </h1>
      <OrdersTableWidget ownerAddress={address} networkId={networkId} />
    </Wrapper>
  )
}

export default TransactionDetails
