import React from 'react'
import styled from 'styled-components'

import { TokenErc20 } from '@gnosis.pm/dex-js'

import { OrderKind } from 'api/operator'
import { capitalize } from 'utils'
import { useNetworkId } from 'state/network'
import TokenImg from 'components/common/TokenImg'

const TradeTypeWrapper = styled.div`
  display: flex;
  justify-content: left;

  span {
    margin: 0 0.4rem 0 0;
  }
  img {
    width: 1.6rem;
    height: 1.6rem;
    margin: 0 0.4rem 0 0;
  }
`
export type TradeTypeProps = {
  buyToken: TokenErc20 | null | undefined
  sellToken: TokenErc20 | null | undefined
  kind: OrderKind
}

const TradeOrderType = ({ buyToken, sellToken, kind }: TradeTypeProps): JSX.Element | null => {
  const network = useNetworkId()

  if (!buyToken || !sellToken || !network) {
    return null
  }

  const isBuyOrder = kind === 'buy'
  // This is <base>/<quote> like as base instrument / counter intrument
  const [baseToken, quoteToken] = isBuyOrder ? [buyToken, sellToken] : [sellToken, buyToken]

  return (
    <TradeTypeWrapper>
      <span>{capitalize(kind)}</span> <TokenImg address={baseToken.address} />
      <span>{baseToken.symbol}</span>
      <span>for</span>
      <TokenImg address={quoteToken.address} />
      <span>{quoteToken.symbol}</span>
    </TradeTypeWrapper>
  )
}

export default TradeOrderType
