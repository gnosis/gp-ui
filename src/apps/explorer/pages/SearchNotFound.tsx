import React from 'react'

import { OrderNotFound } from 'components/orders/OrderNotFound'
import { WrapperPage } from './styled'

const SearchNotFound: React.FC = () => {
  return (
    <WrapperPage>
      <OrderNotFound />
    </WrapperPage>
  )
}

export default SearchNotFound
