import React from 'react'
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'

import { ThemeToggler } from 'storybook/decorators'

import { SimpleTable, Props as SimpleTableProps } from './'

export default {
  title: 'Common/SimpleTable',
  component: SimpleTable,
  decorators: [ThemeToggler],
} as Meta

const header = (
  <tr>
    <th>Name</th>
    <th>Year</th>
  </tr>
)

export const BasicTable: React.FC = () => (
  <SimpleTable header={header}>
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
  </SimpleTable>
)
