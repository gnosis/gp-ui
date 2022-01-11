import React, { useEffect, useRef, useState } from 'react'

import { MenuBarToggle, Navigation } from 'components/layout/GenericLayout/Navigation'
import { Header as GenericHeader } from 'components/layout/GenericLayout/Header'
import { NetworkSelector } from 'components/NetworkSelector'
import { PREFIX_BY_NETWORK_ID, useNetworkId } from 'state/network'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FlexWrap } from 'apps/explorer/pages/styled'

export const Header: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [isBarActive, setBarActive] = useState(false)

  useEffect(() => {
    const isClickedOutside = (e: any): void => {
      isBarActive && ref.current && !ref.current.contains(e.target) && setBarActive(false)
    }
    document.addEventListener('mousedown', isClickedOutside)
    return (): void => {
      document.removeEventListener('mousedown', isClickedOutside)
    }
  }, [isBarActive])
  const networkId = useNetworkId()
  if (!networkId) {
    return null
  }

  const prefixNetwork = PREFIX_BY_NETWORK_ID.get(networkId)

  return (
    <GenericHeader logoAlt="CoW Protocol Explorer" linkTo={`/${prefixNetwork || ''}`}>
      <NetworkSelector networkId={networkId} />
      <FlexWrap ref={ref} grow={1}>
        <MenuBarToggle isActive={isBarActive} onClick={(): void => setBarActive(!isBarActive)}>
          <FontAwesomeIcon icon={faBars} />
        </MenuBarToggle>
        <Navigation isActive={isBarActive}>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="cow.fi">CoW Protocol</Link>
          </li>
          <li>
            <Link to="docs.cow.fi">Documentation</Link>
          </li>
          <li>
            <Link to="chat.cowswap.exchange">Community</Link>
          </li>
        </Navigation>
      </FlexWrap>
    </GenericHeader>
  )
}
