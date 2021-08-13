import React from 'react'
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'

import { GlobalStyles, ThemeToggler } from 'storybook/decorators'

import { Card, CardBaseProps } from '.'
import { CardContent } from './cardContent'

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

const defaultProps: CardBaseProps = {
  children: <CardContent label={'30 Day Voulme'} value={'$103.56M'} hint={'+1.03%'} status={'success'} />,
}

export const Default = Template.bind({})
Default.args = {
  ...defaultProps,
}
