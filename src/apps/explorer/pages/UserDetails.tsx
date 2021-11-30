import React from 'react'
import { useParams } from 'react-router'

import { isAddress } from 'web3-utils'

import OrdersTableWidget from '../components/OrdersTableWidget'
import { useNetworkId } from 'state/network'
import { BlockExplorerLink } from 'components/common/BlockExplorerLink'
import RedirectToSearch from 'components/RedirectToSearch'
import { TitleAddress, Wrapper } from 'apps/explorer/pages/styled'

const UserDetails: React.FC = () => {
  const { address } = useParams<{ address: string }>()
  const networkId = useNetworkId() || undefined

  if (!isAddress(address)) {
    return <RedirectToSearch from="address" />
  }

  return (
    <Wrapper>
      <h1>
        User details
        <TitleAddress
          textToCopy={address}
          contentsToDisplay={<BlockExplorerLink type="address" networkId={networkId} identifier={address} />}
        />
      </h1>
      <OrdersTableWidget ownerAddress={address} networkId={networkId} />
    </Wrapper>
  )
}

export default UserDetails
