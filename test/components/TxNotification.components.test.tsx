import React from 'react'
import { shallow } from 'enzyme'

import { TxNotification } from 'components/TxNotification'

import { TX_HASH } from '../data'
import { BlockExplorerLink } from 'apps/gp-v1/components/common/BlockExplorerLink'

describe('<TxNotification />', () => {
  it('renders with link component', () => {
    const wrapper = shallow(<TxNotification txHash={TX_HASH} />)
    expect(wrapper.text()).toMatch(/^The transaction has been sent! Check .* for details$/)
    expect(wrapper.contains(<BlockExplorerLink type="tx" identifier={TX_HASH} />)).toBeTruthy()
  })

  it('does not render component', () => {
    // TODO: was not able to mock EtherscanLink and make it return `null`.
    // Leaving this test here to remember to come back to it eventually.
    expect(true).toEqual(true)
  })
})
