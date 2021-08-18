import React, { useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Link } from 'react-router-dom'
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons'

import { TokenErc20, formatSmart, safeTokenName } from '@gnosis.pm/dex-js'
import { Order } from 'api/operator'

import { DateDisplay } from 'components/orders/DateDisplay'
import { RowWithCopyButton } from 'components/orders/RowWithCopyButton'
import { formatSmartMaxPrecision, getOrderLimitPrice } from 'utils'
import { StatusLabel } from '../StatusLabel'
import { HelpTooltip } from 'components/Tooltip'
import {
  HIGH_PRECISION_DECIMALS,
  HIGH_PRECISION_SMALL_LIMIT,
  NO_ADJUSTMENT_NEEDED_PRECISION,
} from 'apps/explorer/const'
import TradeOrderType from '../TradeOrderType'
import StyledUserDetailsTable, { StyledUserDetailsTableProps } from './styled'
import Icon from 'components/Icon'

const Wrapper = styled(StyledUserDetailsTable)`
  > thead > tr,
  > tbody > tr {
    grid-template-columns: 12rem 20rem repeat(2, 13rem) 16rem 13rem 1fr;
  }
`
function isTokenErc20(token: TokenErc20 | null | undefined): token is TokenErc20 {
  return (token as TokenErc20).address !== undefined
}

const formattedAmount = (erc20: TokenErc20 | null | undefined, amount: BigNumber): string => {
  if (!isTokenErc20(erc20)) return '-'

  return erc20.decimals ? formatSmartMaxPrecision(amount, erc20) : amount.toString(10)
}

const getLimitPrice = (order: Order, isPriceInverted: boolean): string => {
  if (!order.buyToken || !order.sellToken) return '-'

  const calculatedPrice = getOrderLimitPrice({
    order,
    buyTokenDecimals: order.buyToken.decimals,
    sellTokenDecimals: order.sellToken.decimals,
    inverted: isPriceInverted,
  })
  const displayPrice = calculatedPrice.toString(10)
  const formattedPrice = formatSmart({
    amount: displayPrice,
    precision: NO_ADJUSTMENT_NEEDED_PRECISION,
    smallLimit: HIGH_PRECISION_SMALL_LIMIT,
    decimals: HIGH_PRECISION_DECIMALS,
  })
  const buySymbol = safeTokenName(order.buyToken)
  const sellSymbol = safeTokenName(order.sellToken)

  const [baseSymbol, quoteSymbol] = isPriceInverted ? [sellSymbol, buySymbol] : [buySymbol, sellSymbol]

  return `${formattedPrice} ${quoteSymbol} per ${baseSymbol}`
}

const tooltip = {
  orderID: 'A unique identifier ID for this order.',
}

export type Props = StyledUserDetailsTableProps & {
  orders: Order[]
}

const OrdersUserDetailsTable: React.FC<Props> = (props) => {
  const { orders, showBorderTable = false } = props
  const [isPriceInverted, setIsPriceInverted] = useState(false)

  const invertLimitPrice = (): void => {
    setIsPriceInverted((previousValue) => !previousValue)
  }

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
            <td>{getLimitPrice(item, isPriceInverted)}</td>
            <td>
              <DateDisplay date={creationDate} />
            </td>
            <td>
              <StatusLabel status={item.status} partiallyFilled={partiallyFilled} />
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
          <th>
            Limit price <Icon icon={faExchangeAlt} onClick={invertLimitPrice} />
          </th>
          <th>Creation time</th>
          <th>Status</th>
        </tr>
      }
      body={orderItems(orders)}
    />
  )
}

export default OrdersUserDetailsTable
