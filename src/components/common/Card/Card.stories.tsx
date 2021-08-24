import React from 'react'
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'

import { GlobalStyles, ThemeToggler } from 'storybook/decorators'

import { Card, CardBaseProps } from '.'

export default {
  title: 'Common/Card',
  component: Card,
  decorators: [GlobalStyles, ThemeToggler],
} as Meta

const Template: Story<CardBaseProps> = (args) => (
  <div>
    <Card {...args}>{args.children}</Card>
  </div>
)

const defaultProps: CardBaseProps = {}

export const Default = Template.bind({})
Default.args = {
  ...defaultProps,
}
