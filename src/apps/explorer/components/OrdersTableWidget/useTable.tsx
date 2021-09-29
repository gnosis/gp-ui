import { useState } from 'react'

export interface TableState {
  pageSize: number
  pageOffset: number
}

export interface TableOptions {
  initialState: TableState
}

interface TableStateAndSetters {
  state: TableState
  setPageSize: (pageSize: number) => void
  setPageOffset: (pageOffset: number) => void
}

export function useTable(options: TableOptions): TableStateAndSetters {
  const {
    initialState: { pageSize: initialPageSize, pageOffset: initialOffset },
  } = options
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [pageOffset, setPageOffset] = useState(initialOffset)

  const state: TableState = { pageSize, pageOffset }

  return { state, setPageSize, setPageOffset }
}
