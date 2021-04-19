import React from 'react'
import BigNumber from 'bignumber.js'

import { TokenErc20 } from '@gnosis.pm/dex-js'

import { Order } from 'api/operator'

import { Network } from 'types'

import { useNetworkId } from 'state/network'

import { formatSmartMaxPrecision } from 'utils'

import { TokenDisplay } from 'components/common/TokenDisplay'

import { RowContents, RowTitle, /*UsdAmount,*/ Wrapper } from './styled'

type RowProps = {
  title: string
  titleSuffix?: string
  amount: BigNumber
  erc20: TokenErc20
  network: Network
}

function Row(props: RowProps): JSX.Element {
  const { title, titleSuffix, amount, erc20, network } = props

  // TODO: calculate real usd amount
  // const usdAmount = '31231.32'

  // Decimals are optional on ERC20 spec. In that unlikely case, graceful fallback to raw amount
  const formattedAmount = erc20.decimals ? formatSmartMaxPrecision(amount, erc20) : amount.toString(10)

  return (
    <>
      <RowTitle>
        {title} {titleSuffix && titleSuffix}
      </RowTitle>
      <RowContents>
        <span>{formattedAmount}</span>
        {/* <UsdAmount>(~${usdAmount})</UsdAmount> */}
        <TokenDisplay erc20={erc20} network={network} />
      </RowContents>
    </>
  )
}

export type Props = { order: Order }

export function AmountsDisplay(props: Props): JSX.Element | null {
  const { order } = props
  const { kind, buyAmount, buyToken, sellAmount, feeAmount, sellToken } = order
  const network = useNetworkId()

  if (!buyToken || !sellToken || !network) {
    return null
  }

  const isBuyOrder = kind === 'buy'

  return (
    <Wrapper>
      <Row
        title="From"
        titleSuffix={isBuyOrder ? 'at most' : ''}
        amount={sellAmount.plus(feeAmount)}
        erc20={sellToken}
        network={network}
      />
      <Row
        title="To"
        titleSuffix={!isBuyOrder ? 'at least' : ''}
        amount={buyAmount}
        erc20={buyToken}
        network={network}
      />
    </Wrapper>
  )
}
