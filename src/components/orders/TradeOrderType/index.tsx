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

  return (
    <TradeTypeWrapper>
      <span>{capitalize(kind)}</span> <TokenImg address={buyToken.address} />
      <span>{buyToken.symbol}</span>
      <span>for</span>
      <TokenImg address={sellToken.address} />
      <span>{sellToken.symbol}</span>
    </TradeTypeWrapper>
  )
}

export default TradeOrderType
