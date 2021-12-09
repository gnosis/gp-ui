import React from 'react'
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'
import TransactionTable, { Props as TransactionTableProps } from '.'
import { sub } from 'date-fns'
import BigNumber from 'bignumber.js'
import { GlobalStyles, ThemeToggler, Router, NetworkDecorator } from 'storybook/decorators'

import { Trade } from 'api/operator'
import { RICH_TRADE, TUSD, WETH } from '../../../../test/data'

export default {
  title: 'transaction/TransactionTable',
  decorators: [Router, GlobalStyles, NetworkDecorator, ThemeToggler],
  component: TransactionTable,
} as Meta

const tradeBuy: Trade = {
  ...RICH_TRADE,
  kind: 'buy',
  orderId: 'bdef89ac',
  buyToken: WETH,
  sellToken: TUSD,
  buyAmount: new BigNumber('1500000000000000000'), // 1.5WETH
  sellAmount: new BigNumber('7500000000000000000000'), // 7500 TUSD
  executionTime: sub(new Date(), { hours: 1 }),
  surplusPercentage: new BigNumber(3.34),
  surplusAmount: new BigNumber(1342.34),
  txHash: '0x489d8fd1efd43394c7c2b26216f36f1ab49b8d67623047e0fcb60efa2a2c420b',
}

const tradeSell: Trade = {
  ...RICH_TRADE,
  orderId: '4a36dacc',
  buyAmount: new BigNumber('300000000000000'), // 3000 USDT
  sellAmount: new BigNumber('1000000000000000000'), // 1WETH
  executionTime: sub(new Date(), { hours: 48 }),
  surplusPercentage: new BigNumber(-3.34),
  surplusAmount: new BigNumber(1342.34),
}

const Template: Story<TransactionTableProps> = (args) => <TransactionTable {...args} />

export const Default = Template.bind({})
Default.args = { trades: [tradeBuy, tradeSell], showBorderTable: true }

export const EmptyTrades = Template.bind({})
EmptyTrades.args = { trades: [], showBorderTable: true }
