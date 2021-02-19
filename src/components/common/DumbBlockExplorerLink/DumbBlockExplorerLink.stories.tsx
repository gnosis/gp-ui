import React from 'react'
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'

import { DumbBlockExplorerLink, Props } from '.'
import { Network } from 'types'
import {
  ADDRESS_ACCOUNT_XDAI,
  ADDRESS_GNOSIS_PROTOCOL_XDAI,
  ADDRESS_GNO_XDAI,
  ADDRESS_GNO,
  ADDRESS_GNOSIS_PROTOCOL,
  ADDRESS_GNOSIS_PROTOCOL_RINKEBY,
  TX_EXAMPLE,
  TX_XDAI,
} from 'storybook/data'

const networkIds = Object.values(Network).filter(Number.isInteger)

export default {
  title: 'Common/DumbBlockExplorerLink',
  component: DumbBlockExplorerLink,
  argTypes: {
    label: { control: 'text' },
    networkId: { control: { type: 'inline-radio', options: networkIds } },
  },
} as Meta

const Template: Story<Props> = (args) => <DumbBlockExplorerLink {...args} />

const defaultParams: Props = {
  type: 'tx',
  identifier: TX_EXAMPLE,
  networkId: Network.Mainnet,
}

export const NoNetwork = Template.bind({})
NoNetwork.args = {
  ...defaultParams,
  networkId: undefined,
}

export const Mainnet = Template.bind({})
Mainnet.args = {
  ...defaultParams,
}

export const Rinkeby = Template.bind({})
Rinkeby.args = {
  ...defaultParams,
  networkId: Network.Rinkeby,
  type: 'contract',
  label: 'Gnosis Protocol (Rinkeby)',
  identifier: ADDRESS_GNOSIS_PROTOCOL_RINKEBY,
}

export const Labeled = Template.bind({})
Labeled.args = {
  ...defaultParams,
  label: '👀View transaction...',
}

export const Contract = Template.bind({})
Contract.args = {
  ...defaultParams,
  type: 'contract',
  label: 'Gnosis Protocol contract',
  identifier: ADDRESS_GNOSIS_PROTOCOL,
}

export const Token = Template.bind({})
Token.args = {
  ...defaultParams,
  type: 'token',
  label: 'GNO token',
  identifier: ADDRESS_GNO,
}

export const TxXdai = Template.bind({})
TxXdai.storyName = 'Tx on xDAI'
TxXdai.args = {
  ...defaultParams,
  networkId: Network.xDAI,
  type: 'tx',
  identifier: TX_XDAI,
}

export const ContractXDai = Template.bind({})
ContractXDai.storyName = 'Contract on xDAI'
ContractXDai.args = {
  ...defaultParams,
  networkId: Network.xDAI,
  type: 'contract',
  identifier: ADDRESS_GNOSIS_PROTOCOL_XDAI,
}

export const TokenXDai = Template.bind({})
TokenXDai.storyName = 'Token on xDAI'
TokenXDai.args = {
  ...defaultParams,
  networkId: Network.xDAI,
  type: 'token',
  identifier: ADDRESS_GNO_XDAI,
}

export const AddressXDai = Template.bind({})
AddressXDai.storyName = 'Address on xDAI'
AddressXDai.args = {
  ...defaultParams,
  networkId: Network.xDAI,
  type: 'address',
  identifier: ADDRESS_ACCOUNT_XDAI,
}
