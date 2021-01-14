import React from 'react'
import { PageWrapper } from 'components/layout'
import DepositWidget from 'components/DepositWidget'

const Deposit: React.FC = () => (
  <PageWrapper $autoWidth>
    <DepositWidget />
  </PageWrapper>
)

export default Deposit
