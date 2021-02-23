import React from 'react'
import styled from 'styled-components'

import { Order } from 'api/operator'

import { formatSmart, safeTokenName } from 'utils'
import {
  HIGH_PRECISION_DECIMALS,
  HIGH_PRECISION_SMALL_LIMIT,
  LOW_PRECISION_DECIMALS,
  NO_ADJUSTMENT_NEEDED_PRECISION,
  PERCENTAGE_PRECISION,
} from 'apps/explorer/const'

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
        {formatSmart({
          amount: surplusPercentage.toString(10),
          precision: PERCENTAGE_PRECISION,
          decimals: LOW_PRECISION_DECIMALS,
        })}
      </Surplus>
      <span>
        {formatSmart({
          amount: surplusAmount.toString(10),
          precision: surplusToken.decimals,
          decimals: HIGH_PRECISION_DECIMALS,
          smallLimit: HIGH_PRECISION_SMALL_LIMIT,
        })}{' '}
        {safeTokenName(surplusToken)}
      </span>
      <UsdAmount>
        (~$
        {formatSmart({
          amount: usdAmount,
          precision: NO_ADJUSTMENT_NEEDED_PRECISION,
          decimals: LOW_PRECISION_DECIMALS,
        })}
        )
      </UsdAmount>
    </Wrapper>
  )
}
