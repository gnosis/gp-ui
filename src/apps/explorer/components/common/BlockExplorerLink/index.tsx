import React from 'react'

import { DumbBlockExplorerLink, Props } from 'components/common/DumbBlockExplorerLink'
import { useNetworkId } from 'state/network'

/**
 * Explorer app version of BlockExplorerLink
 *
 * Relies on app state to fetch networkId
 */
export function BlockExplorerLink(props: Props): JSX.Element {
  const networkId = useNetworkId() || undefined

  return <DumbBlockExplorerLink {...props} networkId={networkId} />
}
