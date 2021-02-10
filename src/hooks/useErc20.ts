import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { TokenErc20 } from '@gnosis.pm/dex-js'

import { Network } from 'types'

import {
  useGetErc20FromGlobalState,
  useGetMultipleErc20sFromGlobalState,
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

export type UseMultipleErc20Params = { addresses: string[]; networkId?: Network }

/**
 * Fetches multiple erc20 token details for given network and addresses
 * More efficient method to fetch many tokens at once, and avoid unnecessary re-renders
 *
 * Tries to get it from globalState.
 * If not found, tries to get it from the network.
 * Saves to globalState if found.
 *`value` is an object with the `address` as key and it's value is either `null` when not found or the erc20
 * Returns `isLoading` to indicate whether fetching the value
 * Returns `error` with the error messages, if any.
 */
export function useMultipleErc20(params: UseMultipleErc20Params): Return<Record<string, SingleErc20State>> {
  const { addresses, networkId } = params

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const getMultipleErc20 = useGetMultipleErc20sFromGlobalState(networkId)
  const saveErc20s = useSaveErc20sToGlobalState(networkId)

  // local copy of globalState
  const erc20s = useMemo(() => getMultipleErc20(addresses), [addresses, getMultipleErc20])
  // check what on globalState has not been fetched yet
  const toFetch = useMemo(() => addresses.filter((address) => !erc20s[address]), [addresses, erc20s])
  // flow control
  const running = useRef(false)

  const loadFromNetwork = useCallback(
    async (toFetch: string[]): Promise<void> => {
      if (!networkId || toFetch.length === 0) {
        return
      }

      running.current = true

      setIsLoading(true)
      setError('')

      const promises = toFetch.map(
        async (address): Promise<SingleErc20State> => {
          try {
            const erc20 = await getErc20Info({ tokenAddress: address, networkId, web3, erc20Api })

            return erc20
          } catch (e) {
            const msg = `Failed to fetch erc20 details for ${address} on network ${networkId}`
            console.error(msg, e)
            setError((errors) => [errors, msg].filter(Boolean).join('\n'))
            // When failed, return null for given token
            return null
          }
        },
      )

      const fetched = await Promise.all(promises)

      // Save to global state newly fetched tokens that are not null
      saveErc20s(
        fetched.reduce<TokenErc20[]>((acc, erc20) => {
          if (erc20) {
            acc.push(erc20 as TokenErc20)
          }
          return acc
        }, []),
      )

      setIsLoading(false)
      running.current = false
    },
    [networkId, saveErc20s],
  )

  useEffect(() => {
    // only trigger network query if not yet running and there's anything not found yet
    if (!running.current && toFetch.length > 0) {
      loadFromNetwork(toFetch)
    }
  }, [loadFromNetwork, toFetch, saveErc20s])

  // Not sure this `useMemo` is necessary
  return useMemo(() => ({ isLoading, error, value: erc20s }), [erc20s, error, isLoading])
}
