import React from 'react'
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'

import { GlobalStyles, ThemeToggler } from 'storybook/decorators'

import { SimpleTable, Props } from './'

export default {
  title: 'Common/SimpleTable',
  component: SimpleTable,
  decorators: [ThemeToggler, GlobalStyles],
  argTypes: { header: { control: null }, children: { control: null } },
} as Meta

const Template: Story<Props & { Component?: typeof SimpleTable }> = (args) => {
  const { Component = SimpleTable, ...rest } = args
  return <Component {...rest} />
}

export const BasicTable = Template.bind({})
BasicTable.args = {
  numColumns: 2,
  header: (
    <tr>
      <th>Name</th>
      <th>Year</th>
    </tr>
  ),
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
        <td>2021</td>
      </tr>
    </>
  ),
}
