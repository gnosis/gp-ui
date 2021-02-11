import { useEffect } from 'react'
import { useLocation } from 'react-router'

import { Network } from 'types'
import useGlobalState from 'hooks/useGlobalState'

import { setNetwork } from './actions'
import { ExplorerAppState } from 'apps/explorer/state'

export function useNetworkId(): Network | null {
  const [{ networkId }] = useGlobalState<ExplorerAppState>()

  return networkId
}

export function useNetworkOrDefault(): Network {
  const [{ networkId }] = useGlobalState<ExplorerAppState>()

  return networkId || Network.Mainnet
}

function getNetworkId(network: string | undefined): Network {
  switch (network) {
    case 'rinkeby':
      return Network.Rinkeby
    case 'xdai':
      return Network.xDAI
    default:
      return Network.Mainnet
  }
}

export function useNetworkUpdater(): void {
  // TODO: why not using useDispatch from https://react-redux.js.org/introduction/quick-start
  // const dispatch = useDispatch()
  const [, dispatch] = useGlobalState()
  const currentNetworkId = useNetworkId()
  const location = useLocation()

  useEffect(() => {
    const networkMatchArray = location.pathname.match('^/(rinkeby|xdai)')
    const network = networkMatchArray && networkMatchArray.length > 0 ? networkMatchArray[1] : undefined
    const networkId = getNetworkId(network)

    // Update the network if it's different
    if (currentNetworkId !== networkId) {
      dispatch(setNetwork(networkId))
    }
  }, [location, currentNetworkId, dispatch])
}
