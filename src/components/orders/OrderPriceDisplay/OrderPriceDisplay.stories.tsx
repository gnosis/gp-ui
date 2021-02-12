import React from 'react'
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'

import { GlobalStyles, ThemeToggler } from 'storybook/decorators'

import { ORDER, WETH, USDT } from '../../../../test/data'

import { OrderPriceDisplay, Props } from './'

export default {
  title: 'Orders/OrderPriceDisplay',
  component: OrderPriceDisplay,
  decorators: [GlobalStyles, ThemeToggler],
  argTypes: { order: { control: null }, buyToken: { control: null }, sellToken: { control: null } },
} as Meta

const Template: Story<Props> = (args) => <OrderPriceDisplay {...args} />

const defaultArgs: Props = {
  order: {
    ...ORDER,
    buyToken: WETH.address,
    sellToken: USDT.address,
    buyAmount: '1000000000000000000',
    sellAmount: '2000000000',
    executedBuyAmount: '700000000000000000',
    executedSellAmount: '1000000000',
    kind: 'sell',
  },
  buyToken: WETH,
  sellToken: USDT,
}

export const Default = Template.bind({})
Default.args = { ...defaultArgs }

export const PriceInverted = Template.bind({})
PriceInverted.args = { ...defaultArgs, invertedPrice: true }

export const LimitPrice = Template.bind({})
LimitPrice.args = { ...defaultArgs, type: 'limit' }

export const ExecutedPrice = Template.bind({})
ExecutedPrice.args = { ...defaultArgs, type: 'executed' }
