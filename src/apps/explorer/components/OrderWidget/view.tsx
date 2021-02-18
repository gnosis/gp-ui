import React from 'react'
import styled from 'styled-components'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Order } from 'api/operator'

import { OrderDetails } from 'components/orders/OrderDetails'

const Wrapper = styled.div`
  padding: 1.6rem 0;
`

export type Props = {
  order: Order | null
  isLoading: boolean
  error?: string
}

export const OrderWidgetView: React.FC<Props> = (props) => {
  const { order, isLoading, error } = props

  return (
    <Wrapper>
      <h2>Order details</h2>
      {/* TODO: create common loading indicator */}
      {order?.buyToken && order?.sellToken && <OrderDetails order={order} />}
      {!order && !isLoading && <p>Order not found</p>}
      {!isLoading && (!order?.buyToken || !order?.sellToken) && <p>Not able to load tokens</p>}
      {/* TODO: do a better error display. Toast notification maybe? */}
      {error && <p>{error}</p>}
      {isLoading && <FontAwesomeIcon icon={faSpinner} spin size="3x" />}
    </Wrapper>
  )
}
