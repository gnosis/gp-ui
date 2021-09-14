import React from 'react'
import { useParams } from 'react-router'
import styled from 'styled-components'

import { isAddress } from 'web3-utils'

import { media } from 'theme/styles/media'
import NotFound from './NotFound'
import OrdersTableWidget from '../components/OrdersTableWidget'
import { useNetworkId } from 'state/network'
import { BlockExplorerLink } from 'components/common/BlockExplorerLink'
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
const TitleAddress = styled(RowWithCopyButton)`
  font-size: ${({ theme }): string => theme.fontSizeDefault};
  font-weight: ${({ theme }): string => theme.fontNormal};
  margin: 0 0 0 1.5rem;
  display: flex;
  align-items: center;
`
const UserDetails: React.FC = () => {
  const { address } = useParams<{ address: string }>()
  const networkId = useNetworkId() || undefined

  if (!isAddress(address)) {
    return <NotFound />
  } else {
    return (
      <Wrapper>
        <h1>
          User details
          <TitleAddress
            textToCopy={address}
            contentsToDisplay={<BlockExplorerLink type="address" networkId={networkId} identifier={address} />}
          />
        </h1>
        <OrdersTableWidget ownerAddress={address} />
      </Wrapper>
    )
  }
}

export default UserDetails
