import React from 'react'
import { useParams } from 'react-router-dom'

import { OrderNotFound } from 'components/orders/OrderNotFound'
import { WrapperPage } from './styled'
import { isAnAddressAccount, isAnOrderId } from 'utils'
import NotFound from 'apps/explorer/pages/NotFound'

const SearchNotFound: React.FC = () => {
  const { searchString } = useParams<{ searchString: string }>()

  if (!isAnAddressAccount(searchString) && !isAnOrderId(searchString)) {
    return <NotFound />
  }

  return (
    <WrapperPage>
      <OrderNotFound searchString={searchString} />
    </WrapperPage>
  )
}

export default SearchNotFound
