import React from 'react'
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'

import { GlobalStyles, ThemeToggler } from 'storybook/decorators'

import { Card } from '../Card/index'
import { CardRow, CardRowProps } from '.'
import { CardContent } from '../Card/cardContent'

export default {
  title: 'Common/CardRow',
  component: CardRow,
  decorators: [GlobalStyles, ThemeToggler],
} as Meta

const Template: Story<CardRowProps> = (args) => (
  <CardRow {...args}>
    <>
      <Card>
        <CardContent label={'30 Day Voulme'} value={'$103.56M'} hint={'+1.03%'} status={'success'} />
      </Card>
      <Card>
        <CardContent label={'24H Voulme'} value={'$103.56M'} hint={'+1.03%'} status={'success'} />
      </Card>
      <Card>
        <CardContent label={'24H Trades'} value={'194'} hint={'-3.45%'} status={'danger'} />
      </Card>
      <Card>
        <CardContent label={'Last Batch'} value={'3m 42s ago'} />
      </Card>
      <Card>
        <CardContent label={'Total Tokens'} value={'193'} />
      </Card>
    </>
  </CardRow>
)

const defaultProps: CardRowProps = { overflow: true }

export const Default = Template.bind({})
Default.args = { ...defaultProps }
