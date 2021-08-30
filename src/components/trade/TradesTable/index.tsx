import React, { useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Link } from 'react-router-dom'
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons'

import { TokenErc20 } from '@gnosis.pm/dex-js'
import { Trade } from 'api/operator'

import { DateDisplay } from 'components/common/DateDisplay'
import { RowWithCopyButton } from 'components/common/RowWithCopyButton'
import {
  formatSmartMaxPrecision,
  getOrderLimitPrice,
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

const Wrapper = styled(StyledUserDetailsTable)`
  > thead > tr,
  > tbody > tr {
    grid-template-columns: 12rem 5rem 10rem repeat(2, 12rem) 16rem 12rem 1fr;
  }
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

  const calculatedPrice = isPriceInverted ? trade.sellAmount : trade.buyAmount

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
            className="wrap-copybtn"
            textToCopy={orderId}
            contentsToDisplay={<Link to={`/trades/${trade.orderId}`}>{orderId}</Link>}
          />
        }
      </td>
      <td>
        <TradeOrderType kind={kind} />
      </td>
      <td>
        {trade.surplusPercentage && trade.surplusAmount && (
          <Surplus surplusPercentage={trade.surplusPercentage} surplusAmount={trade.surplusAmount} />
        )}
      </td>
      <td>
        {formattedAmount(buyToken, buyAmount)} {buyToken?.symbol}
      </td>
      <td>
        {formattedAmount(sellToken, sellAmount)} {sellToken?.symbol}
      </td>
      <td>{getLimitPrice(trade, isPriceInverted)}</td>
      <td>{getExecutedPrice(trade, isPriceInverted)}</td>
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
            Tx ID <HelpTooltip tooltip={tooltip.tradeID} />
          </th>
          <th>Type</th>
          <th>Surplus</th>
          <th>Buy Amount</th>
          <th>Sell Amount</th>
          <th>
            Limit price <Icon icon={faExchangeAlt} onClick={invertLimitPrice} />
          </th>
          <th>
            Execution price <Icon icon={faExchangeAlt} onClick={invertLimitPrice} />
          </th>
          <th>Execution Time</th>
        </tr>
      }
      body={tradeItems(trades)}
    />
  )
}

export default TradesTable
