import React from 'react'

import { Order } from 'api/operator'

export enum OrdersTableState {
  Loading,
  Loaded,
  Error,
}

interface CommonState {
  orders: Order[]
  error: string
  kind: OrdersTableState
}

export const OrdersTableContext = React.createContext({} as CommonState)
