import React from 'react'

import { useOrderIdParam } from 'hooks/useSanitizeOrderIdAndUpdateUrl'
import NotFound from 'apps/explorer/pages/NotFound'
import { isAnOrderId } from 'utils'

import { OrderWidget } from '../components/OrderWidget'
import { WrapperPage } from './styled'

const Order: React.FC = () => {
  const orderId = useOrderIdParam()

  if (!isAnOrderId(orderId)) {
    return <NotFound />
  }

  return (
    <WrapperPage>
      <OrderWidget />
    </WrapperPage>
  )
}

export default Order
