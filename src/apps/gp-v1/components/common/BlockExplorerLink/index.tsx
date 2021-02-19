import React from 'react'

import { DumbBlockExplorerLink, Props } from 'components/common/DumbBlockExplorerLink'

import { useWalletConnection } from 'hooks/useWalletConnection'

export const BlockExplorerLink: React.FC<Props> = (props) => {
  const { networkId: networkIdFixed } = props
  const { networkIdOrDefault: networkIdWallet } = useWalletConnection()

  const networkId = networkIdFixed || networkIdWallet

  return <DumbBlockExplorerLink {...props} networkId={networkId} />
}
