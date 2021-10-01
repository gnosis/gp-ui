import { useState } from 'react'

export interface TableState {
  pageSize: number
  pageOffset: number
  hasNextPage?: boolean
}

export interface TableOptions {
  initialState: TableState
}

interface TableStateAndSetters {
  state: TableState
  setPageSize: (pageSize: number) => void
  setPageOffset: (pageOffset: number) => void | number
}

export function useTable(options: TableOptions): TableStateAndSetters {
  const {
    initialState: { pageSize: initialPageSize, pageOffset: initialOffset },
  } = options
  const [pageSize, _setPageSize] = useState(initialPageSize)
  const [pageOffset, setPageOffset] = useState(initialOffset)

  const state = { pageSize, pageOffset }

  const setPageSize = (newValue: number): void => {
    _setPageSize(newValue)
    setPageOffset(0)
  }

  return { state, setPageSize, setPageOffset }
}
