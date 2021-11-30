import React from 'react'
import { useParams } from 'react-router'

import { isAddress } from 'web3-utils'

import NotFound from './NotFound'
import OrdersTableWidget from '../components/OrdersTableWidget'
import { useNetworkId } from 'state/network'
import { BlockExplorerLink } from 'components/common/BlockExplorerLink'
import { TitleAddress, Wrapper } from 'apps/explorer/pages/styled'

const TransactionDetails: React.FC = () => {
  const { transactionId } = useParams<{ transactionId: string }>()
  const networkId = useNetworkId() || undefined
  if (!isAddress(transactionId)) {
    return <NotFound />
  } else {
    return (
      <Wrapper>
        <h1>
          Transaction details
          <TitleAddress
            textToCopy={transactionId}
            contentsToDisplay={<BlockExplorerLink type="address" networkId={networkId} identifier={transactionId} />}
          />
        </h1>
        <OrdersTableWidget ownerAddress={transactionId} networkId={networkId} />
      </Wrapper>
    )
  }
}

export default TransactionDetails
