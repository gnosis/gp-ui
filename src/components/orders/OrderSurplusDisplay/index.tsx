import React from 'react'
import styled from 'styled-components'

import { Order } from 'api/operator'

import { formatSmart, safeTokenName } from 'utils'

const Wrapper = styled.div`
  display: flex;

  & > * {
    margin-right: 0.25rem;
  }

  & > :last-child {
    margin-right: 0;
  }
`

const Surplus = styled.span`
  ::before {
    content: '+';
  }
  ::after {
    content: '%';
  }

  color: ${({ theme }): string => theme.surplusPercentage};
`

const UsdAmount = styled.span`
  color: ${({ theme }): string => theme.bgDisabled};
`

export type Props = { order: Order }

export function OrderSurplusDisplay(props: Props): JSX.Element | null {
  const {
    order: { kind, buyToken, sellToken, surplusAmount, surplusPercentage },
  } = props

  const surplusToken = kind === 'buy' ? sellToken : buyToken

  // TODO: get USD estimation
  const usdAmount = '55.555'

  if (!surplusToken || surplusAmount.isZero()) {
    return null
  }

  return (
    <Wrapper>
      <Surplus>
        {formatSmart({ amount: surplusPercentage.multipliedBy('100').toString(10), precision: 0, decimals: 2 })}
      </Surplus>
      <span>
        {formatSmart({
          amount: surplusAmount.toString(10),
          precision: surplusToken.decimals,
          decimals: 8,
          smallLimit: '0.00000001',
        })}{' '}
        {safeTokenName(surplusToken)}
      </span>
      <UsdAmount>(~${formatSmart({ amount: usdAmount, precision: 0, decimals: 8 })})</UsdAmount>
    </Wrapper>
  )
}
