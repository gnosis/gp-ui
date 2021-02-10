import { useCallback } from 'react'

import { TokenErc20 } from '@gnosis.pm/dex-js'

import { Network } from 'types'

import useGlobalState from 'hooks/useGlobalState'

import { buildErc20Key, Erc20State } from '.'
import { saveMultipleErc20 } from './actions'

export type SingleErc20State = TokenErc20 | null

/**
 * Syntactic sugar to get erc20 from global state.
 * Returns a function that fetches the TokenErc20 or null for the given address
 *
 * @param networkId The network id
 */
export const useGetErc20FromGlobalState = <State extends { erc20s: Erc20State }>(
  networkId?: Network,
): ((address?: string) => SingleErc20State) => {
  const [{ erc20s }] = useGlobalState<State>()

  return useCallback(
    (address?: string): SingleErc20State => {
      if (!address || !networkId) {
        return null
      }

      return erc20s.get(buildErc20Key(networkId, address)) || null
    },
    [erc20s, networkId],
  )
}

/**
 * Syntactic sugar to get erc20s from global state.
 * Returns a function that fetches the a map of address to TokenErc20 or null
 * It'll always include the input token address in the output, even if not found
 *
 * @param networkId The network id
 */
export const useGetMultipleErc20sFromGlobalState = <State extends { erc20s: Erc20State }>(
  networkId?: Network,
): ((addresses: string[]) => Record<string, SingleErc20State>) => {
  const [{ erc20s }] = useGlobalState<State>()

  return useCallback(
    (addresses: string[]): Record<string, SingleErc20State> => {
      if (!networkId) {
        // Return map of address => null
        return addresses.reduce((acc, address) => ({ ...acc, [address]: null }), {})
      }

      return addresses.reduce(
        (acc, address) => ({ ...acc, [address]: erc20s.get(buildErc20Key(networkId, address)) || null }),
        {},
      )
    },
    [erc20s, networkId],
  )
}

/**
 * Syntactic sugar to save erc20s to global state
 * Returns a function that takes a list of TokenErc20 objects as parameter
 *
 * @param networkId The network id
 */
export const useSaveErc20sToGlobalState = <State extends { erc20s: Erc20State }>(
  networkId?: Network,
): ((erc20s: TokenErc20[]) => void) => {
  const [, dispatch] = useGlobalState<State>()

  return useCallback(
    (erc20s: TokenErc20[]): void => {
      networkId && dispatch(saveMultipleErc20(erc20s, networkId))
    },
    [dispatch, networkId],
  )
}
