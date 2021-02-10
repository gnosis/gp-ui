import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { TokenErc20 } from '@gnosis.pm/dex-js'

import { Network } from 'types'

import {
  useGetErc20FromGlobalState,
  useSaveErc20sToGlobalState,
  SingleErc20State,
} from 'state/erc20'

import { getErc20Info } from 'services/helpers'

import { web3, erc20Api } from 'apps/explorer/api'

type UseErc20Params = { address?: string; networkId?: Network }

type Return<V> = { isLoading: boolean; error?: string; value: V }

/**
 * Fetches single erc20 token details for given network and address
 *
 * Tries to get it from globalState.
 * If not found, tries to get it from the network.
 * Saves to globalState if found.
 * Value is `null` when not found.
 * Returns `isLoading` to indicate whether fetching the value
 * Returns `error` with the error message, if any.
 */
export function useErc20(params: UseErc20Params): Return<SingleErc20State> {
  const { address, networkId } = params

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const getErc20 = useGetErc20FromGlobalState(networkId)
  const saveErc20s = useSaveErc20sToGlobalState(networkId)

  // Local copy of globalState
  const erc20 = useMemo(() => getErc20(address), [address, getErc20])

  useEffect(() => {
    // Only try to fetch it if not on global state
    if (!erc20 && address && networkId) {
      setIsLoading(true)
      setError('')

      getErc20Info({ tokenAddress: address, networkId, web3, erc20Api })
        .then((fetchedErc20) => {
          // When not found, it returns null
          if (fetchedErc20) {
            saveErc20s([fetchedErc20])
          }
        })
        .catch((e) => {
          // Set error only when the call fails
          // Not finding the token is not an error
          const msg = `Failed to fetch erc20 details for ${address} on network ${networkId}`
          console.error(msg, e)
          setError(msg)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [address, erc20, networkId, saveErc20s])

  return { isLoading, error, value: erc20 }
}
