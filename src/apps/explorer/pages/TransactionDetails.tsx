import React from 'react'
import { useParams } from 'react-router'

import { isAddress } from 'web3-utils'

import NotFound from './NotFound'
import OrdersTableWidget from '../components/OrdersTableWidget'
import { useNetworkId } from 'state/network'
import { BlockExplorerLink } from 'components/common/BlockExplorerLink'
import { TitleAddress, Wrapper } from 'apps/explorer/pages/styled'

const TransactionDetails: React.FC = () => {
  const { address } = useParams<{ address: string }>()
  const networkId = useNetworkId() || undefined
  console.log('address: ', address, 'NETWORKID: ', networkId, 'ISADDRESS: ', isAddress(address))
  if (!isAddress(address)) {
    return <NotFound />
  } else {
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
}

export default TransactionDetails
