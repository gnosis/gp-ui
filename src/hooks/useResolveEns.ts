import { isAddress } from 'web3-utils'
import { useState, useEffect } from 'react'
import { isEns } from 'utils'
import { resolveENS } from './useSearchSubmit'

export interface ResolvedEns {
  address: string | null
  ens?: string
}

export function useResolveEns(address: string): ResolvedEns | undefined {
  const [resolvedEns, setResolvedEns] = useState<ResolvedEns | undefined>()

  useEffect(() => {
    async function _resolveENS(name: string): Promise<void> {
      const _address = await resolveENS(name)
      setResolvedEns({ address: _address, ens: name })
    }

    setResolvedEns(undefined)
    if (isEns(address)) {
      _resolveENS(address)
    } else if (isAddress(address)) {
      setResolvedEns({ address })
    } else {
      setResolvedEns({ address: null })
    }
  }, [address])

  return resolvedEns
}
