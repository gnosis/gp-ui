import React from 'react'

// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Meta, Story } from '@storybook/react/types-6-0'
import { GlobalStyles, ThemeToggler } from 'storybook/decorators'

import StyledTabs from './ExplorerTab'
import { Props as TabsProps } from '../../../../../components/common/Tabs/Tabs'

export default {
  title: 'ExplorerApp/ExplorerTabs',
  component: StyledTabs,
  decorators: [GlobalStyles, ThemeToggler],
} as Meta

const tabItems = [
  {
    id: 1,
    tab: 'Orders',
    content: <h2>Orders Content</h2>,
  },
  {
    id: 2,
    tab: 'Trades',
    content: <h2>Trades Content</h2>,
  },
]

const Template: Story<TabsProps> = (args) => <StyledTabs {...args} />

export const DefaultTabs = Template.bind({})
DefaultTabs.args = { tabItems }
