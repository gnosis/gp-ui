import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import styled from 'styled-components'

import { isAddress } from 'web3-utils'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { media } from 'theme/styles/media'
import OrdersTableWidget from '../components/OrdersTableWidget'
import { useNetworkId } from 'state/network'
import { BlockExplorerLink } from 'components/common/BlockExplorerLink'
import { RowWithCopyButton } from 'components/common/RowWithCopyButton'
import RedirectToSearch from 'components/RedirectToSearch'
import { isEns } from 'utils'
import { resolveENS } from 'hooks/useSearchSubmit'

const Wrapper = styled.div`
  padding: 1.6rem;
  margin: 0 auto;
  width: 100%;

  ${media.mediumDown} {
    max-width: 94rem;
  }

  ${media.mobile} {
    max-width: 100%;
  }
  > h1 {
    display: flex;
    padding: 2.4rem 0 2.35rem;
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
  const [resolvedAddress, setResolvedAddress] = useState<string | undefined | null>()

  useEffect(() => {
    async function _resolveENS(): Promise<void> {
      const _address = await resolveENS(address)
      setResolvedAddress(_address)
    }

    if (isAddress(address)) {
      setResolvedAddress(address)
    } else if (isEns(address)) {
      _resolveENS()
    }
  }, [address, networkId])

  if (resolvedAddress === null) {
    return <RedirectToSearch from="address" />
  }

  return (
    <Wrapper>
      {resolvedAddress ? (
        <>
          <h1>
            User details
            <TitleAddress
              textToCopy={resolvedAddress}
              contentsToDisplay={
                <BlockExplorerLink
                  type="address"
                  networkId={networkId}
                  identifier={address}
                  label={isEns(address) ? address : undefined}
                />
              }
            />
          </h1>
          <OrdersTableWidget ownerAddress={resolvedAddress} networkId={networkId} />
        </>
      ) : (
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
      )}
    </Wrapper>
  )
}

export default UserDetails
