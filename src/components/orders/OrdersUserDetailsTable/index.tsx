import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Link } from 'react-router-dom'

import { calculatePrice, TokenErc20, formatSmart } from '@gnosis.pm/dex-js'
import { Order } from 'api/operator'

import { DateDisplay } from 'components/orders/DateDisplay'
import { RowWithCopyButton } from 'components/orders/RowWithCopyButton'
import { formatSmartMaxPrecision } from 'utils'
import { StatusLabel } from '../StatusLabel'
import { HelpTooltip } from 'components/Tooltip'
import {
  HIGH_PRECISION_DECIMALS,
  HIGH_PRECISION_SMALL_LIMIT,
  NO_ADJUSTMENT_NEEDED_PRECISION,
} from 'apps/explorer/const'
import TradeOrderType from '../TradeOrderType'
import StyledUserDetailsTable, { StyledUserDetailsTableProps } from './styled'

const Wrapper = styled(StyledUserDetailsTable)`
  > thead > tr,
  > tbody > tr {
    grid-template-columns: 12rem 23rem repeat(2, 13rem) 16rem 10rem 1fr;
  }
`
function isTokenErc20(token: TokenErc20 | null | undefined): token is TokenErc20 {
  return (token as TokenErc20).address !== undefined
}

const formattedAmount = (erc20: TokenErc20 | null | undefined, amount: BigNumber): string => {
  if (!isTokenErc20(erc20)) return '-'

  return erc20.decimals ? formatSmartMaxPrecision(amount, erc20) : amount.toString(10)
}

const getLimitPrice = (order: Order): string => {
  if (!order.buyToken || !order.sellToken) return '-'

  const calculatedPrice = calculatePrice({
    denominator: { amount: order.buyAmount, decimals: order.buyToken.decimals },
    numerator: { amount: order.sellAmount, decimals: order.sellToken.decimals },
  })
  const displayPrice = calculatedPrice.toString(10)
  const formattedPrice = formatSmart({
    amount: displayPrice,
    precision: NO_ADJUSTMENT_NEEDED_PRECISION,
    smallLimit: HIGH_PRECISION_SMALL_LIMIT,
    decimals: HIGH_PRECISION_DECIMALS,
  })

  return `${formattedPrice} ${order.sellToken?.symbol} per ${order.buyToken?.symbol}`
}

const tooltip = {
  orderID: 'A unique identifier ID for this order.',
}

export type Props = StyledUserDetailsTableProps & {
  orders: Order[]
}

const OrdersUserDetailsTable: React.FC<Props> = (props) => {
  const { orders, showBorderTable = false } = props

  const orderItems = (items: Order[]): JSX.Element => (
    <>
      {items.map((item) => {
        const { creationDate, buyToken, buyAmount, sellToken, sellAmount, kind, partiallyFilled, shortId, uid } = item
        const isBuyOrder = kind === 'buy'
        // This is <base>/<quote> like as base instrument / counter intrument
        const [baseToken, quoteToken] = isBuyOrder ? [buyToken, sellToken] : [sellToken, buyToken]

        return (
          <tr key={shortId}>
            <td>
              {
                <RowWithCopyButton
                  className="span-copybtn-wrap"
                  textToCopy={uid}
                  contentsToDisplay={<Link to={`/orders/${item.uid}`}>{shortId}</Link>}
                />
              }
            </td>
            <td>
              <TradeOrderType buyToken={baseToken} sellToken={quoteToken} kind={kind} />
            </td>
            <td>
              {formattedAmount(buyToken, buyAmount)} {buyToken?.symbol}
            </td>
            <td>
              {formattedAmount(sellToken, sellAmount)} {sellToken?.symbol}
            </td>
            <td>{getLimitPrice(item)}</td>
            <td>
              <StatusLabel status={item.status} partiallyFilled={partiallyFilled} />
            </td>
            <td>
              <DateDisplay date={creationDate} />
            </td>
          </tr>
        )
      })}
    </>
  )

  return (
    <Wrapper
      showBorderTable={showBorderTable}
      header={
        <tr>
          <th>
            Order ID <HelpTooltip tooltip={tooltip.orderID} />
          </th>
          <th>Type</th>
          <th>Buy amount</th>
          <th>Sell amount</th>
          <th>Limit price</th>
          <th>Status</th>
          <th>Creation time</th>
        </tr>
      }
      body={orderItems(orders)}
    />
  )
}

export default OrdersUserDetailsTable
