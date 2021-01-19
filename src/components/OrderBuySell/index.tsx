import React from 'react'
import styled from 'styled-components'
import Tabs, { getTabTheme, TabItemInterface } from 'components/common/Tabs/Tabs'

const tabItems: TabItemInterface[] = [
  {
    id: 1,
    tab: 'BUY',
    content: '- buy component -',
  },
  {
    id: 2,
    tab: 'SELL',
    content: '- sell component -',
  },
]

const tabThemeConfig = getTabTheme({
  activeBg: '--color-long',
  activeBgAlt: '--color-short',
  inactiveBg: '--color-primary',
  activeText: '--color-primary',
  inactiveText: '--color-primary2',
})

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  padding: var(--padding-container-default);
`

const OrderBuySell: React.FC = () => (
  <Wrapper>
    <Tabs tabItems={tabItems} tabTheme={tabThemeConfig} />
  </Wrapper>
)

export default OrderBuySell
