import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { media } from 'theme/styles/media'
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons'

import { Order } from 'api/operator'

import { DateDisplay } from 'components/common/DateDisplay'
import { RowWithCopyButton } from 'components/common/RowWithCopyButton'
import { getOrderLimitPrice, formatCalculatedPriceToDisplay, formattedAmount, FormatAmountPrecision } from 'utils'
import { StatusLabel } from '../StatusLabel'
import { HelpTooltip } from 'components/Tooltip'
import StyledUserDetailsTable, {
  Props as StyledUserDetailsTableProps,
  EmptyItemWrapper,
} from '../../common/StyledUserDetailsTable'
import Icon from 'components/Icon'
import TradeOrderType from 'components/common/TradeOrderType'
import { LinkWithPrefixNetwork } from 'components/common/LinkWithPrefixNetwork'
import { TextWithTooltip } from 'apps/explorer/components/common/TextWithTooltip'

const Wrapper = styled(StyledUserDetailsTable)`
  > thead > tr,
  > tbody > tr {
    grid-template-columns: 12rem 7rem repeat(2, minmax(16rem, 1.5fr)) repeat(2, minmax(18rem, 2fr)) 1fr;
  }

  ${media.mediumDown} {
    > thead > tr {
      display: none;
    }
    > tbody > tr {
      grid-template-columns: none;
      border: 0.1rem solid ${({ theme }): string => theme.tableRowBorder};
      box-shadow: 0px 4px 12px ${({ theme }): string => theme.boxShadow};
      border-radius: 6px;
      margin-top: 16px;
      padding: 12px;
      &:hover {
        background: none;
        backdrop-filter: none;
      }
    }
    tr > td {
      display: flex;
      flex: 1;
      width: 100%;
      justify-content: space-between;
      margin: 0;
      margin-bottom: 18px;
    }
    .header-value {
      flex-wrap: wrap;
      text-align: end;
    }
    .span-copybtn-wrap {
      display: flex;
      flex-wrap: nowrap;
      span {
        display: flex;
        align-items: center;
      }
      .copy-text {
        margin-left: 5px;
      }
    }
  }
  overflow: auto;
`

const HeaderTitle = styled.span`
  display: none;
  ${media.mediumDown} {
    font-weight: 600;
    align-items: center;
    display: flex;
    margin-right: 3rem;
    svg {
      margin-left: 5px;
    }
  }
`
const HeaderValue = styled.span`
  ${media.mediumDown} {
    flex-wrap: wrap;
    text-align: end;
  }
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
  isPriceInverted: boolean
}

const RowOrder: React.FC<RowProps> = ({ order, isPriceInverted }) => {
  const { creationDate, buyToken, buyAmount, sellToken, sellAmount, kind, partiallyFilled, shortId, uid } = order
  const [_isPriceInverted, setIsPriceInverted] = useState(isPriceInverted)

  useEffect(() => {
    setIsPriceInverted(isPriceInverted)
  }, [isPriceInverted])

  const invertLimitPrice = (): void => {
    setIsPriceInverted((previousValue) => !previousValue)
  }

  return (
    <tr key={shortId}>
      <td>
        <HeaderTitle>
          Order ID <HelpTooltip tooltip={tooltip.orderID} />
        </HeaderTitle>
        <HeaderValue>
          <RowWithCopyButton
            className="span-copybtn-wrap"
            textToCopy={uid}
            contentsToDisplay={
              <LinkWithPrefixNetwork to={`/orders/${order.uid}`} rel="noopener noreferrer" target="_blank">
                {shortId}
              </LinkWithPrefixNetwork>
            }
          />
        </HeaderValue>
      </td>
      <td>
        <HeaderTitle>Type</HeaderTitle>
        <span className="header-value">
          <TradeOrderType kind={kind} />
        </span>
      </td>
      <td>
        <HeaderTitle>Sell Amount</HeaderTitle>
        <HeaderValue>
          <TextWithTooltip
            textInTooltip={`${formattedAmount(sellToken, sellAmount.plus(order.feeAmount))} ${sellToken?.symbol}`}
          >
            {formattedAmount(sellToken, sellAmount.plus(order.feeAmount), FormatAmountPrecision.highPrecision)}{' '}
            {sellToken?.symbol}
          </TextWithTooltip>
        </HeaderValue>
      </td>
      <td>
        <HeaderTitle>Buy amount</HeaderTitle>
        <HeaderValue>
          <TextWithTooltip textInTooltip={`${formattedAmount(buyToken, buyAmount)} ${buyToken?.symbol}`}>
            {formattedAmount(buyToken, buyAmount, FormatAmountPrecision.highPrecision)} {buyToken?.symbol}
          </TextWithTooltip>
        </HeaderValue>
      </td>
      <td>
        <HeaderTitle>
          Limit price <Icon icon={faExchangeAlt} onClick={invertLimitPrice} />
        </HeaderTitle>
        <HeaderValue>{getLimitPrice(order, _isPriceInverted)}</HeaderValue>
      </td>
      <td>
        <HeaderTitle>Created</HeaderTitle>
        <HeaderValue>
          <DateDisplay date={creationDate} showIcon={true} />
        </HeaderValue>
      </td>
      <td>
        <HeaderTitle>Status</HeaderTitle>
        <HeaderValue>
          <StatusLabel status={order.status} partiallyFilled={partiallyFilled} />
        </HeaderValue>
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
          <RowOrder key={item.shortId} order={item} isPriceInverted={isPriceInverted} />
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
