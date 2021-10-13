import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { isAnAddressAccount, isAnOrderId } from 'utils'

export function pathAccordingTo(query: string): string {
  if (isAnAddressAccount(query)) {
    return 'address'
  } else if (isAnOrderId(query)) {
    return 'orders'
  }

  return 'search'
}

export function useSearchSubmit(): (query: string) => void {
  const history = useHistory()

  return useCallback(
    (query: string) => {
      // For now assumes /orders/ path. Needs logic to try all types for a valid response:
      // Orders, transactions, tokens, batches
      query && query.length > 0 && history.push(`/${pathAccordingTo(query)}/${query}`)
    },
    [history],
  )
}
