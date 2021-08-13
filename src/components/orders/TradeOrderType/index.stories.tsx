import React from 'react'
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'
import { GlobalStyles, ThemeToggler, NetworkDecorator } from 'storybook/decorators'

import { USDT, WETH, TUSD } from '../../../../test/data'

import TradeOrderType, { TradeTypeProps } from '.'
import { OrderKind } from 'api/operator/signatures'

export default {
  title: 'orders/TradeOrderType',
  decorators: [GlobalStyles, NetworkDecorator, ThemeToggler],
  component: TradeOrderType,
} as Meta

const Template: Story<TradeTypeProps> = (args) => <TradeOrderType {...args} />

const buyOrder = {
  buyToken: WETH,
  sellToken: USDT,
  kind: OrderKind.BUY,
}

const sellOrder = {
  buyToken: TUSD,
  sellToken: WETH,
  kind: OrderKind.SELL,
}

export const BuyTradeOrderType = Template.bind({})
BuyTradeOrderType.args = { ...buyOrder }

export const SellTradeOrderType = Template.bind({})
SellTradeOrderType.args = { ...sellOrder }
