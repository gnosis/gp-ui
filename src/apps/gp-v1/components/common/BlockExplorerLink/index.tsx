import React from 'react'

import { BlockExplorerLink, Props } from 'components/common/BlockExplorerLink'

import { useWalletConnection } from 'hooks/useWalletConnection'

export const BlockExplorerLink: React.FC<Props> = (props) => {
  const { networkId: networkIdFixed } = props
  const { networkIdOrDefault: networkIdWallet } = useWalletConnection()

  const networkId = networkIdFixed || networkIdWallet

  return <BlockExplorerLink {...props} networkId={networkId} />
}
