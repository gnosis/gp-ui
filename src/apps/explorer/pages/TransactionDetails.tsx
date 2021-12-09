import React from 'react'
import { useParams } from 'react-router'

import { isAddress } from 'web3-utils'

import NotFound from './NotFound'
import OrdersTableWidget from '../components/OrdersTableWidget'
import { useNetworkId } from 'state/network'
import { BlockExplorerLink } from 'components/common/BlockExplorerLink'
import { TitleAddress, Wrapper } from 'apps/explorer/pages/styled'

export const TransactionDetails: React.FC = () => {
  const { hash } = useParams<{ hash: string }>()
  const networkId = useNetworkId() || undefined
  if (!isAddress(hash)) {
    return <NotFound />
  } else {
    return (
      <Wrapper>
        <h1>
          Transaction details
          <TitleAddress
            textToCopy={hash}
            contentsToDisplay={<BlockExplorerLink type="tx" networkId={networkId} identifier={hash} />}
          />
        </h1>
        <OrdersTableWidget ownerAddress={hash} networkId={networkId} />
      </Wrapper>
    )
  }
}

export default TransactionDetails
