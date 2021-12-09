import React, { useState } from 'react'
import styled from 'styled-components'
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons'

import { MockedTransaction, Trade } from 'api/operator'

import { DateDisplay } from 'components/common/DateDisplay'
import { RowWithCopyButton } from 'components/common/RowWithCopyButton'
import { getOrderLimitPrice, formatCalculatedPriceToDisplay, formattedAmount } from 'utils'
import { getShortOrderId } from 'utils/operator'
import { HelpTooltip } from 'components/Tooltip'
import StyledUserDetailsTable, {
  StyledUserDetailsTableProps,
  EmptyItemWrapper,
} from '../../common/StyledUserDetailsTable'
import Icon from 'components/Icon'
import TradeOrderType from 'components/common/TradeOrderType'
import { LinkWithPrefixNetwork } from 'components/common/LinkWithPrefixNetwork'
import { StatusLabel } from 'components/orders/StatusLabel'

const Wrapper = styled(StyledUserDetailsTable)`
  > thead > tr,
  > tbody > tr {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1.5fr 1fr;
  }
`

function getLimitPrice(transaction: MockedTransaction, isPriceInverted: boolean): string {
  if (!transaction.buyToken || !transaction.sellToken) return '-'

  const calculatedPrice = getOrderLimitPrice({
    buyAmount: transaction.buyAmount,
    sellAmount: transaction.sellAmount,
    buyTokenDecimals: transaction.buyToken.decimals,
    sellTokenDecimals: transaction.sellToken.decimals,
    inverted: isPriceInverted,
  })

  return formatCalculatedPriceToDisplay(calculatedPrice, transaction.buyToken, transaction.sellToken, isPriceInverted)
}

const tooltip = {
  tradeID: 'A unique identifier ID for this trade.',
}

export type Props = StyledUserDetailsTableProps & {
  transactions: MockedTransaction[]
  trades: Trade[]
}

interface RowProps {
  transaction: MockedTransaction
  isPriceInverted: boolean
}

const RowTransaction: React.FC<RowProps> = ({ transaction, isPriceInverted }) => {
  const { buyToken, buyAmount, executionTime, partiallyFilled, sellToken, sellAmount, kind, orderId } = transaction

  return (
    <tr key={orderId}>
      <td>
        <RowWithCopyButton
          className="span-copybtn-wrap"
          textToCopy={orderId}
          contentsToDisplay={
            <LinkWithPrefixNetwork to={`/orders/${transaction.orderId}`} rel="noopener noreferrer" target="_blank">
              {getShortOrderId(orderId)}
            </LinkWithPrefixNetwork>
          }
        />
      </td>
      <td>
        <TradeOrderType kind={kind || 'sell'} />
      </td>
      <td>
        {formattedAmount(sellToken, sellAmount)} {sellToken?.symbol}
      </td>
      <td>
        {formattedAmount(buyToken, buyAmount)} {buyToken?.symbol}
      </td>
      <td>{getLimitPrice(transaction, isPriceInverted)}</td>
      <td>
        <DateDisplay date={executionTime} showIcon={true} />
      </td>
      <td>
        <StatusLabel status={transaction.status} partiallyFilled={partiallyFilled} />
      </td>
    </tr>
  )
}

const TransactionTable: React.FC<Props> = (props) => {
  const { transactions, showBorderTable = false } = props
  const [isPriceInverted, setIsPriceInverted] = useState(false)

  const invertLimitPrice = (): void => {
    setIsPriceInverted((previousValue) => !previousValue)
  }

  const transactionItems = (items: MockedTransaction[]): JSX.Element => {
    if (!items || items.length === 0) return <EmptyItemWrapper>No Details.</EmptyItemWrapper>
    console.log(items)
    return (
      <>
        {items.map((item) => (
          <RowTransaction key={item.orderId} transaction={item} isPriceInverted={isPriceInverted} />
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
            Order ID <HelpTooltip tooltip={tooltip.tradeID} />
          </th>
          <th>Type</th>
          <th>Sell Amount</th>
          <th>Buy Amount</th>
          <th>
            Limit price <Icon icon={faExchangeAlt} onClick={invertLimitPrice} />
          </th>
          <th>Created</th>
          <th>Status</th>
        </tr>
      }
      body={transactionItems(transactions)}
    />
  )
}

export default TransactionTable
