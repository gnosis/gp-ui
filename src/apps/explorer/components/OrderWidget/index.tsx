import React from 'react'
import { useParams } from 'react-router'

import { useOrderAndErc20s } from 'hooks/useOperatorOrder'
import { OrderWidgetView } from './view'

export const OrderWidget: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>()

  const { order, buyToken, sellToken, isLoading, error } = useOrderAndErc20s(orderId)

  return (
    <OrderWidgetView
      order={order}
      isLoading={isLoading}
      error={error}
      buyToken={buyToken || undefined}
      sellToken={sellToken || undefined}
    />
  )
}
