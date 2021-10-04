import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { MEDIA } from 'const'
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons'

import { Order } from 'api/operator'

import { DateDisplay } from 'components/common/DateDisplay'
import { RowWithCopyButton } from 'components/common/RowWithCopyButton'
import { getOrderLimitPrice, formatCalculatedPriceToDisplay, formattedAmount } from 'utils'
import { StatusLabel } from '../StatusLabel'
import { HelpTooltip } from 'components/Tooltip'
import StyledUserDetailsTable, {
  Props as StyledUserDetailsTableProps,
  EmptyItemWrapper,
} from '../../common/StyledUserDetailsTable'
import Icon from 'components/Icon'
import TradeOrderType from 'components/common/TradeOrderType'
import { LinkWithPrefixNetwork } from 'components/common/LinkWithPrefixNetwork'

const Wrapper = styled(StyledUserDetailsTable)`
  > thead > tr,
  > tbody > tr {
    grid-template-columns: 12rem 7rem repeat(2, minmax(16rem, 1.5fr)) repeat(2, minmax(18rem, 2fr)) 1fr;
  }

  .header-title {
    display: none;
  }

  @media ${MEDIA.mobile} {
    > thead > tr {
      display: none;
    }
    > tbody > tr {
      border: 0.1rem solid rgb(151 151 184 / 10%);
      border-radius: 6px;
      margin-top: 16px;
    }
    tr > td:first-of-type {
      margin: 0;
    }
    tr > td {
      display: flex;
      flex: 1;
      width: 100%;
      justify-content: space-between;
      margin: 0;
      line-height: 2;
    }
    .header-title {
      font-weight: 600;
      align-items: center;
      display: flex;
      svg {
        margin-left: 5px;
      }
    }
    .span-copybtn-wrap {
      span {
        display: inline-flex;
      }
    }
  }
  overflow: auto;
`
function getLimitPrice(order: Order, isPriceInverted: boolean): string {
  if (!order.buyToken || !order.sellToken) return '-'

  const calculatedPrice = getOrderLimitPrice({
    buyAmount: order.buyAmount,
    sellAmount: order.sellAmount,
    buyTokenDecimals: order.buyToken.decimals,
    sellTokenDecimals: order.sellToken.decimals,
    inverted: isPriceInverted,
  })

  return formatCalculatedPriceToDisplay(calculatedPrice, order.buyToken, order.sellToken, isPriceInverted)
}

const tooltip = {
  orderID: 'A unique identifier ID for this order.',
}

export type Props = StyledUserDetailsTableProps & {
  orders: Order[]
}

interface RowProps {
  order: Order
  _isPriceInverted: boolean
}

const RowOrder: React.FC<RowProps> = ({ order, _isPriceInverted }) => {
  const { creationDate, buyToken, buyAmount, sellToken, sellAmount, kind, partiallyFilled, shortId, uid } = order
  const [isPriceInverted, setIsPriceInverted] = useState(_isPriceInverted)

  useEffect(() => {
    setIsPriceInverted(_isPriceInverted)
  }, [_isPriceInverted])

  const invertLimitPrice = (): void => {
    setIsPriceInverted((previousValue) => !previousValue)
  }

  return (
    <tr key={shortId}>
      <td>
        <span className="header-title">
          Order ID <HelpTooltip tooltip={tooltip.orderID} />
        </span>
        <RowWithCopyButton
          className="span-copybtn-wrap"
          textToCopy={uid}
          contentsToDisplay={
            <LinkWithPrefixNetwork to={`/orders/${order.uid}`} rel="noopener noreferrer" target="_blank">
              {shortId}
            </LinkWithPrefixNetwork>
          }
        />
      </td>
      <td>
        <span className="header-title">Type</span>
        <TradeOrderType kind={kind} />
      </td>
      <td>
        <span className="header-title">Sell Amount</span>
        {formattedAmount(sellToken, sellAmount.plus(order.feeAmount))} {sellToken?.symbol}
      </td>
      <td>
        <span className="header-title">Buy amount</span>
        {formattedAmount(buyToken, buyAmount)} {buyToken?.symbol}
      </td>
      <td>
        <span className="header-title">
          Limit price <Icon icon={faExchangeAlt} onClick={invertLimitPrice} />
        </span>
        {getLimitPrice(order, isPriceInverted)}
      </td>
      <td>
        <span className="header-title">Created</span>
        <DateDisplay date={creationDate} showIcon={true} />
      </td>
      <td>
        <span className="header-title">Status</span>
        <StatusLabel status={order.status} partiallyFilled={partiallyFilled} />
      </td>
    </tr>
  )
}

const OrdersUserDetailsTable: React.FC<Props> = (props) => {
  const { orders, showBorderTable = false } = props
  const [isPriceInverted, setIsPriceInverted] = useState(false)

  const invertLimitPrice = (): void => {
    setIsPriceInverted((previousValue) => !previousValue)
  }

  const orderItems = (items: Order[]): JSX.Element => {
    if (items.length === 0)
      return (
        <tr className="row-empty">
          <td className="row-td-empty">
            <EmptyItemWrapper>No Orders.</EmptyItemWrapper>
          </td>
        </tr>
      )

    return (
      <>
        {items.map((item) => (
          <RowOrder key={item.shortId} order={item} _isPriceInverted={isPriceInverted} />
        ))}
      </>
    )
  }

  return (
    <Wrapper
      showBorderTable={showBorderTable}
      header={
        <tr>
          <th>
            Order ID <HelpTooltip tooltip={tooltip.orderID} />
          </th>
          <th>Type</th>
          <th>Sell amount</th>
          <th>Buy amount</th>
          <th>
            Limit price <Icon icon={faExchangeAlt} onClick={invertLimitPrice} />
          </th>
          <th>Created</th>
          <th>Status</th>
        </tr>
      }
      body={orderItems(orders)}
    />
  )
}

export default OrdersUserDetailsTable
