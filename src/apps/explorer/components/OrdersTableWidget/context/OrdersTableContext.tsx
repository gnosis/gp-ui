import React from 'react'

import { Order } from 'api/operator'
import { TableState } from 'apps/explorer/components/OrdersTableWidget/useTable'

interface CommonState {
  orders: Order[]
  error: string
  isOrdersLoading: boolean
  tableState: TableState
  setPageSize: (pageSize: number) => void
  setPageOffset: (pageOffset: number) => void
}

export const OrdersTableContext = React.createContext({} as CommonState)
