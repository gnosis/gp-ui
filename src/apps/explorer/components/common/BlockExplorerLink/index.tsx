import React from 'react'

import { BlockExplorerLink, Props } from 'components/common/BlockExplorerLink'
import { useNetworkId } from 'state/network'

/**
 * Explorer app version of BlockExplorerLink
 *
 * Relies on app state to fetch networkId
 */
export function BlockExplorerLink(props: Props): JSX.Element {
  const networkId = useNetworkId() || undefined

  return <BlockExplorerLink {...props} networkId={networkId} />
}
