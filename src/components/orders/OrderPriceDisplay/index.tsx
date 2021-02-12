import React, { useCallback, useMemo, useState } from 'react'
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
  const { type = 'limit', order, buyToken, sellToken, invertedPrice: initialInvertedPrice } = props

  const [invertedPrice, setInvertedPrice] = useState(initialInvertedPrice || false)
  const invertPrice = useCallback(() => setInvertedPrice((curr) => !curr), [])

  const getPrice = useMemo(() => (type === 'limit' ? getOrderLimitPrice : getOrderExecutedPrice), [type])

  const displayPrice = useMemo(() => {
    const price = getPrice({
      order,
      buyTokenDecimals: buyToken.decimals,
      sellTokenDecimals: sellToken.decimals,
      inverted: invertedPrice,
    })
    return formatSmart({ amount: price.toString(), precision: 0, smallLimit: '0.000001', decimals: 7 })
  }, [buyToken.decimals, getPrice, invertedPrice, order, sellToken.decimals])

  const [baseSymbol, quoteSymbol] = useMemo(() => {
    const buy = safeTokenName(buyToken)
    const sell = safeTokenName(sellToken)

    return invertedPrice ? [sell, buy] : [buy, sell]
  }, [buyToken, invertedPrice, sellToken])

  return (
    <Wrapper>
      {displayPrice} {baseSymbol} for {quoteSymbol} <Icon icon={faExchangeAlt} onClick={invertPrice} />
    </Wrapper>
  )
}
