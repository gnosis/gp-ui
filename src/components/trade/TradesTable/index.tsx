import React, { useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Link } from 'react-router-dom'
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons'

import { TokenErc20 } from '@gnosis.pm/dex-js'
import { Trade, RawOrder } from 'api/operator'

import { DateDisplay } from 'components/common/DateDisplay'
import { RowWithCopyButton } from 'components/common/RowWithCopyButton'
import {
  formatSmartMaxPrecision,
  getOrderLimitPrice,
  getOrderExecutedPrice,
  formatCalculatedPriceToDisplay,
  formatExecutedPriceToDisplay,
} from 'utils'
import { HelpTooltip } from 'components/Tooltip'
import StyledUserDetailsTable, {
  StyledUserDetailsTableProps,
  EmptyItemWrapper,
} from '../../common/StyledUserDetailsTable'
import Icon from 'components/Icon'
import TradeOrderType from 'components/common/TradeOrderType'
import { Surplus } from './Surplus'
import { RAW_ORDER } from '../../../../test/data'

const Wrapper = styled(StyledUserDetailsTable)`
  > thead > tr,
  > tbody > tr {
    grid-template-columns: 10rem 4rem repeat(2, 10rem) repeat(2, 14rem) 10rem 10rem 1fr;
  }
`

const TxHash = styled.div`
  max-width: 10rem;
  overflow: hidden;
  text-overflow: ellipsis;
`

function isTokenErc20(token: TokenErc20 | null | undefined): token is TokenErc20 {
  return (token as TokenErc20).address !== undefined
}

function formattedAmount(erc20: TokenErc20 | null | undefined, amount: BigNumber): string {
  if (!isTokenErc20(erc20)) return '-'

  return erc20.decimals ? formatSmartMaxPrecision(amount, erc20) : amount.toString(10)
}

function getLimitPrice(trade: Trade, isPriceInverted: boolean): string {
  if (!trade.buyToken || !trade.sellToken) return '-'

  const calculatedPrice = getOrderLimitPrice({
    buyAmount: trade.buyAmount,
    sellAmount: trade.sellAmount,
    buyTokenDecimals: trade.buyToken.decimals,
    sellTokenDecimals: trade.sellToken.decimals,
    inverted: isPriceInverted,
  })

  return formatCalculatedPriceToDisplay(calculatedPrice, trade.buyToken, trade.sellToken, isPriceInverted)
}

function getExecutedPrice(trade: Trade, isPriceInverted: boolean): string {
  if (!trade.buyToken || !trade.sellToken) return '-'

  const order: RawOrder = {
    ...RAW_ORDER,
    executedBuyAmount: trade.executedBuyAmount?.toString() || '',
    executedSellAmount: trade.executedSellAmount?.toString() || '',
    executedFeeAmount: trade.executedFeeAmount?.toString() || '',
  }

  const calculatedPrice = getOrderExecutedPrice({
    order,
    buyTokenDecimals: trade.buyToken.decimals,
    sellTokenDecimals: trade.sellToken.decimals,
    inverted: isPriceInverted,
  })

  return formatExecutedPriceToDisplay(calculatedPrice, trade.buyToken, trade.sellToken, isPriceInverted)
}

const tooltip = {
  tradeID: 'A unique identifier ID for this trade.',
}

export type Props = StyledUserDetailsTableProps & {
  trades: Trade[]
}

interface RowProps {
  trade: Trade
  isPriceInverted: boolean
}

const RowOrder: React.FC<RowProps> = ({ trade, isPriceInverted }) => {
  const { executionTime, buyToken, buyAmount, sellToken, sellAmount, kind, orderId } = trade

  return (
    <tr key={orderId}>
      <td>
        {
          <RowWithCopyButton
            className="span-copybtn-wrap"
            textToCopy={orderId}
            contentsToDisplay={<Link to={`/trades/${trade.orderId}`}>{orderId}</Link>}
          />
        }
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
      <td>{getLimitPrice(trade, isPriceInverted)}</td>
      <td>{getExecutedPrice(trade, isPriceInverted)}</td>
      <td>
        <TxHash>{trade.txHash}</TxHash>
      </td>
      <td>
        {trade.surplusPercentage && trade.surplusAmount && (
          <Surplus surplusPercentage={trade.surplusPercentage} surplusAmount={trade.surplusAmount} />
        )}
      </td>
      <td>
        <DateDisplay date={executionTime} showIcon={true} />
      </td>
    </tr>
  )
}

const TradesTable: React.FC<Props> = (props) => {
  const { trades, showBorderTable = false } = props
  const [isPriceInverted, setIsPriceInverted] = useState(false)

  const invertLimitPrice = (): void => {
    setIsPriceInverted((previousValue) => !previousValue)
  }

  const tradeItems = (items: Trade[]): JSX.Element => {
    if (items.length === 0) return <EmptyItemWrapper>No Trades.</EmptyItemWrapper>

    return (
      <>
        {items.map((item) => (
          <RowOrder key={item.orderId} trade={item} isPriceInverted={isPriceInverted} />
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
          <th>
            Execution price <Icon icon={faExchangeAlt} onClick={invertLimitPrice} />
          </th>
          <th>TxHash</th>
          <th>Surplus</th>
          <th>Trade Time</th>
        </tr>
      }
      body={tradeItems(trades)}
    />
  )
}

export default TradesTable
