import React from 'react'
import { useParams } from 'react-router'

import { isAddress } from 'web3-utils'

import NotFound from './NotFound'
import OrdersTableWidget from '../components/OrdersTableWidget'

const UserDetails: React.FC = () => {
  const { address } = useParams<{ address: string }>()

  if (!isAddress(address)) {
    return <NotFound />
  } else {
    return <OrdersTableWidget ownerAddress={address} />
  }
}

export default UserDetails
