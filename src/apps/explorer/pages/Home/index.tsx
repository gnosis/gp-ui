import React from 'react'
import { Search } from 'apps/explorer/components/common/Search'
import { HomeWrapper } from 'apps/explorer/pages/styled'

export const Home: React.FC = () => {
  return (
    <HomeWrapper>
      <h1>Search Order ID / ETH Address / ENS Address</h1>
      <Search className="home" />
    </HomeWrapper>
  )
}

export default Home
