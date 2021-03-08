import React from 'react'
import styled from 'styled-components'

import { formatSmart, safeTokenName } from '@gnosis.pm/dex-js'

import { Order } from 'api/operator'

import { getSmallLimit } from 'utils'

const Wrapper = styled.div`
  & > span {
    margin: 0 0.5rem 0 0;
  }
`

// const UsdAmount = styled.span`
//   color: ${({ theme }): string => theme.grey};
// `

export type Props = { order: Order }

export function GasFeeDisplay(props: Props): JSX.Element | null {
  const {
    order: { feeAmount, executedFeeAmount, sellToken, sellTokenAddress },
  } = props

  // TODO: fetch amount in USD
  // const executedFeeUSD = '0.99'
  // const totalFeeUSD = '0.35'

  let smallLimit: string | undefined
  // When `sellToken` is not set, default to raw amounts
  let formattedExecutedFee: string = executedFeeAmount.toString(10)
  let formattedTotalFee: string = feeAmount.toString(10)
  // When `sellToken` is not set, show token address
  let quoteSymbol: string = sellTokenAddress

  if (sellToken) {
    smallLimit = getSmallLimit(sellToken.decimals)

    formattedExecutedFee = formatSmart({
      amount: executedFeeAmount.toString(10),
      precision: sellToken.decimals,
      decimals: sellToken.decimals,
      smallLimit,
    })
    formattedTotalFee = formatSmart({
      amount: feeAmount.toString(10),
      precision: sellToken.decimals,
      decimals: sellToken.decimals,
      smallLimit,
    })

    quoteSymbol = safeTokenName(sellToken)
  }

  return (
    <Wrapper>
      <span>
        {formattedExecutedFee} {quoteSymbol}
      </span>
      {/* <UsdAmount>(~${totalFeeUSD})</UsdAmount> */}
      <span>
        of {formattedTotalFee} {quoteSymbol}
      </span>
      {/* <UsdAmount>(~${executedFeeUSD})</UsdAmount> */}
    </Wrapper>
  )
}
