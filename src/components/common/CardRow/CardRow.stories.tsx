import React from 'react'
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'
import styled from 'styled-components'

import { GlobalStyles, ThemeToggler } from 'storybook/decorators'

import { Card } from '../Card/index'
import { CardRow, CardRowProps } from '.'

export default {
  title: 'Common/CardRow',
  component: CardRow,
  decorators: [GlobalStyles, ThemeToggler],
} as Meta

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  p {
    margin-bottom: 0px;
  }
  h3 {
    margin: 2px 3px -1px 3px;
  }
  span {
    font-weight: bold;
    font-size: 12px;
    margin: 2px 1px 2px 0px;
    &.red {
      color: ${({ theme }): string => theme.red1} !important;
    }
    &.green {
      color: ${({ theme }): string => theme.green1} !important;
    }
  }
  div {
    margin-top: 5px;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
  }
`

const Template: Story<CardRowProps> = (args) => (
  <CardRow {...args}>
    <>
      <Card>
        <CardBody>
          <p>30 Day Voulme</p>
          <div>
            <h3>$103.56M</h3>
            <span className="green">+1.03%</span>
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <p>24H Voulme</p>
          <div>
            <h3>$103.56M</h3>
            <span className="green">+1.03%</span>
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <p>24H Voulme</p>
          <div>
            <h3>194</h3>
            <span className="red">-3.45%</span>
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <p>Last Batch</p>
          <div>
            <h3>3m 42s ago</h3>
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <p>Total Tokens</p>
          <div>
            <h3>193</h3>
          </div>
        </CardBody>
      </Card>
    </>
  </CardRow>
)

const defaultProps: CardRowProps = {}

export const Default = Template.bind({})
Default.args = { ...defaultProps }
