import { useState } from 'react'

export interface TableState {
  pageSize: number
  pageOffset: number
  canNextPage?: boolean
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
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [pageOffset, setPageOffset] = useState(initialOffset)

  const state = { pageSize, pageOffset }

  return { state, setPageSize, setPageOffset }
}
