import React, { useState } from 'react'
import styled from 'styled-components'
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { formatSmart, safeTokenName, TokenErc20 } from '@gnosis.pm/dex-js'

import { getOrderExecutedPrice, getOrderLimitPrice, RawOrder } from 'api/operator'

const Wrapper = styled.span`
  display: flex;
  align-items: center;
  font-size: ${({ theme }): string => theme.fontSizeNormal};
`

const Icon = styled(FontAwesomeIcon)`
  background: ${({ theme }): string => theme.textSecondary2}33; /* 33==20% transparency in hex */
  border-radius: 1rem;
  width: 2rem !important; /* FontAwesome sets it to 1em with higher specificity */
  height: 2rem;
  padding: 0.4rem;
  margin-left: 0.5rem;
`

export type Props = {
  type?: 'limit' | 'executed'
  order: RawOrder
  buyToken: TokenErc20
  sellToken: TokenErc20
  invertedPrice?: boolean
}

export function OrderPriceDisplay(props: Props): JSX.Element {
  const { type = 'limit', order, buyToken, sellToken, invertedPrice: initialInvertedPrice = false } = props

  const [invertedPrice, setInvertedPrice] = useState(initialInvertedPrice)
  const invertPrice = (): void => setInvertedPrice((curr) => !curr)

  const getPrice = type === 'limit' ? getOrderLimitPrice : getOrderExecutedPrice

  const price = getPrice({
    order,
    buyTokenDecimals: buyToken.decimals,
    sellTokenDecimals: sellToken.decimals,
    inverted: invertedPrice,
  })
  const displayPrice = formatSmart({ amount: price.toString(), precision: 0, smallLimit: '0.000001', decimals: 7 })

  const baseSymbol = safeTokenName(buyToken)
  const quoteSymbol = safeTokenName(sellToken)

  return (
    <Wrapper>
      {displayPrice} {baseSymbol} for {quoteSymbol} <Icon icon={faExchangeAlt} onClick={invertPrice} />
    </Wrapper>
  )
}
