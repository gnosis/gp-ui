import React from 'react'
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'

import { GlobalStyles, ThemeToggler } from 'storybook/decorators'

import { SimpleTable, Props } from './'

export default {
  title: 'Common/SimpleTable',
  component: SimpleTable,
  decorators: [ThemeToggler, GlobalStyles],
} as Meta

const header = (
  <tr>
    <th>Name</th>
    <th>Year</th>
  </tr>
)
const Template: Story<Props> = (args) => <SimpleTable {...args} />

export const BasicTable = Template.bind({})
BasicTable.args = {
  numColumns: 2,
  header,
  children: (
    <>
      <tr>
        <td>DutchX</td>
        <td>2018</td>
      </tr>
      <tr>
        <td>dxDAO</td>
        <td>2019</td>
      </tr>
      <tr>
        <td>Gnosis Protocol v1</td>
        <td>2020</td>
      </tr>
      <tr>
        <td>Gnosis Protocol v2</td>
        <td>2020</td>
      </tr>
    </>
  ),
}
