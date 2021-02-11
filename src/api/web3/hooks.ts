import { useMemo } from 'react'
import Web3 from 'web3'

import { getNetworkFromId } from '@gnosis.pm/dex-js'

import { useNetworkId } from 'state/network'

import { Network } from 'types'

import { INFURA_ID } from 'const'

import { createWeb3Api } from '.'

function infuraProvider(networkId: Network): string {
  // INFURA_ID relies on mesa `config` file logic.
  // We can be independent of that config by relying on the env var directly
  if (!INFURA_ID) {
    throw new Error(`INFURA_ID not set`)
  }
  return `wss://${getNetworkFromId(networkId).toLowerCase()}.infura.io/ws/v3/${INFURA_ID}`
}

function infuraProviderByNetworkId(networkId: Network | null): string | undefined {
  switch (networkId) {
    case Network.Mainnet:
    case Network.Rinkeby:
    case Network.xDAI:
      return infuraProvider(networkId)
    default:
      return undefined
  }
}

export function useWeb3(): Web3 {
  const networkId = useNetworkId()
  const provider = infuraProviderByNetworkId(networkId)

  // createWeb3 caches instances per provider, safe to call multiple times
  return useMemo(() => createWeb3Api(provider), [provider])
}
