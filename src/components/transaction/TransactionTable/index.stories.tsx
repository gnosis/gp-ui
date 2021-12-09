import React from 'react'
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'
import TransactionTable, { Props as TransactionTableProps } from '.'
import { sub } from 'date-fns'
import BigNumber from 'bignumber.js'
import { GlobalStyles, ThemeToggler, Router, NetworkDecorator } from 'storybook/decorators'

import { MockedTransaction } from 'api/operator'
import { TUSD, WETH } from '../../../../test/data'

export default {
  title: 'transaction/TransactionTable',
  decorators: [Router, GlobalStyles, NetworkDecorator, ThemeToggler],
  component: TransactionTable,
} as Meta

const transactionExBuy: MockedTransaction = {
  kind: 'buy',
  orderId: '0x489d8fd1efd43394c7c2b26216f36f1ab49b8d67623047e0fcb60efa2a2c420b',
  buyToken: WETH,
  sellToken: TUSD,
  buyAmount: new BigNumber('1500000000000000000'), // 1.5WETH
  sellAmount: new BigNumber('7500000000000000000000'), // 7500 TUSD
  executionTime: sub(new Date(), { hours: 1 }),
  txHash: '0x489d8fd1efd43394c7c2b26216f36f1ab49b8d67623047e0fcb60efa2a2c420b',
  partiallyFilled: true,
  status: 'filled',
}

const transactionExSell: MockedTransaction = {
  kind: 'sell',
  orderId: '0x489d8fd1efd43394c7c2b26216f36f1ab49b8d67623047e0fcb60efa2a2c420b',
  buyToken: WETH,
  sellToken: TUSD,
  buyAmount: new BigNumber('1500000000000000000'), // 1.5WETH
  sellAmount: new BigNumber('7500000000000000000000'), // 7500 TUSD
  executionTime: sub(new Date(), { hours: 1 }),
  txHash: '0x489d8fd1efd43394c7c2b26216f36f1ab49b8d67623047e0fcb60efa2a2c420b',
  partiallyFilled: false,
  status: 'open',
}

const Template: Story<TransactionTableProps> = (args) => <TransactionTable {...args} />

export const Default = Template.bind({})
Default.args = { transactions: [transactionExBuy, transactionExSell], showBorderTable: true }

export const EmptyTransactions = Template.bind({})
EmptyTransactions.args = { transactions: [], showBorderTable: true }
