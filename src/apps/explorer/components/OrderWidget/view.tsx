import React from 'react'
import styled from 'styled-components'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { TokenErc20 } from '@gnosis.pm/dex-js'

import { Order } from 'api/operator'

import { OrderDetails } from 'components/orders/OrderDetails'

const Wrapper = styled.div`
  padding: 1.6rem 0;
`

export type Props = {
  order: Order | null
  isLoading: boolean
  error?: string
  buyToken?: TokenErc20
  sellToken?: TokenErc20
}

export const OrderWidgetView: React.FC<Props> = (props) => {
  const { order, isLoading, error, buyToken, sellToken } = props

  return (
    <Wrapper>
      <h2>Order details</h2>
      {/* TODO: create common loading indicator */}
      {order && buyToken && sellToken && <OrderDetails order={order} buyToken={buyToken} sellToken={sellToken} />}
      {!order && !isLoading && <p>Order not found</p>}
      {!isLoading && (!buyToken || !sellToken) && <p>Not able to load tokens</p>}
      {/* TODO: do a better error display. Toast notification maybe? */}
      {error && <p>{error}</p>}
      {isLoading && <FontAwesomeIcon icon={faSpinner} spin size="3x" />}
    </Wrapper>
  )
}
