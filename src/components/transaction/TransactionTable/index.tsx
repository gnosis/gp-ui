import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { faExchangeAlt, faSpinner } from '@fortawesome/free-solid-svg-icons'

import { Order, Trade } from 'api/operator'

import { DateDisplay } from 'components/common/DateDisplay'
import { RowWithCopyButton } from 'components/common/RowWithCopyButton'
import { getOrderLimitPrice, formatCalculatedPriceToDisplay, formattedAmount, FormatAmountPrecision } from 'utils'
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
import { media } from 'theme/styles/media'
import { TextWithTooltip } from 'apps/explorer/components/common/TextWithTooltip'
import { TokenDisplay } from 'components/common/TokenDisplay'
import { useNetworkId } from 'state/network'
import { safeTokenName } from '@gnosis.pm/dex-js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Wrapper = styled(StyledUserDetailsTable)`
  > thead > tr,
  > tbody > tr {
    grid-template-columns: 12rem 7rem repeat(2, minmax(16rem, 1.5fr)) repeat(2, minmax(18rem, 2fr)) 1fr;
  }
  tr > td {
    span.span-inside-tooltip {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      img {
        padding: 0;
      }
    }
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
      min-height: 32px;
      span.span-inside-tooltip {
        align-items: flex-end;
        flex-direction: column;
        img {
          margin-left: 0;
        }
      }
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

function getLimitPrice(transaction: Order, isPriceInverted: boolean): string {
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
  transactions: Order[]
  trades: Trade[]
}

interface RowProps {
  transaction: Order
  isPriceInverted: boolean
  invertLimitPrice: () => void
}

const RowTransaction: React.FC<RowProps> = ({ transaction, isPriceInverted, invertLimitPrice }) => {
  const {
    buyToken,
    buyAmount,
    expirationDate,
    partiallyFilled = false,
    sellToken,
    sellAmount,
    kind,
    txHash,
    shortId,
  } = transaction
  const network = useNetworkId()
  const buyTokenSymbol = buyToken ? safeTokenName(buyToken) : ''
  const sellTokenSymbol = sellToken ? safeTokenName(sellToken) : ''
  const sellFormattedAmount = formattedAmount(sellToken, sellAmount)
  const buyFormattedAmount = formattedAmount(buyToken, buyAmount)
  const renderSpinnerWhenNoValue = (textValue: string): JSX.Element | void => {
    if (textValue === '-') return <FontAwesomeIcon icon={faSpinner} spin size="1x" />
  }
  const limitPriceSettled = getLimitPrice(transaction, isPriceInverted)

  return (
    <tr key={txHash}>
      <td>
        <HeaderTitle>
          Order ID <HelpTooltip tooltip={tooltip} />
        </HeaderTitle>
        <HeaderValue>
          <RowWithCopyButton
            className="span-copybtn-wrap"
            textToCopy={shortId}
            contentsToDisplay={
              <LinkWithPrefixNetwork to={`/tx/${transaction.txHash}`} rel="noopener noreferrer" target="_blank">
                {getShortOrderId(shortId)}
              </LinkWithPrefixNetwork>
            }
          />
        </HeaderValue>
      </td>
      <td>
        <HeaderTitle>Type</HeaderTitle>
        <span className="header-value">
          <TradeOrderType kind={kind || 'sell'} />
        </span>
      </td>
      <td>
        <HeaderTitle>Sell Amount</HeaderTitle>
        <HeaderValue>
          {renderSpinnerWhenNoValue(sellFormattedAmount) || (
            <TextWithTooltip textInTooltip={`${sellFormattedAmount} ${sellTokenSymbol}`}>
              {formattedAmount(sellToken, sellAmount, FormatAmountPrecision.highPrecision)}{' '}
              {sellToken && network && <TokenDisplay showAbbreviated erc20={sellToken} network={network} />}
            </TextWithTooltip>
          )}
        </HeaderValue>
      </td>
      <td>
        <HeaderTitle>Buy amount</HeaderTitle>
        <HeaderValue>
          {renderSpinnerWhenNoValue(buyFormattedAmount) || (
            <TextWithTooltip textInTooltip={`${buyFormattedAmount} ${buyTokenSymbol}`}>
              {formattedAmount(buyToken, buyAmount, FormatAmountPrecision.highPrecision)}{' '}
              {buyToken && network && <TokenDisplay showAbbreviated erc20={buyToken} network={network} />}
            </TextWithTooltip>
          )}
        </HeaderValue>
      </td>
      <td>
        <HeaderTitle>
          Limit price
          <Icon icon={faExchangeAlt} onClick={invertLimitPrice} />
        </HeaderTitle>
        <HeaderValue>{renderSpinnerWhenNoValue(limitPriceSettled) || limitPriceSettled}</HeaderValue>
      </td>
      <td>
        <HeaderTitle>Created</HeaderTitle>
        <HeaderValue>
          <DateDisplay date={expirationDate} showIcon={true} />
        </HeaderValue>
      </td>
      <td>
        <HeaderTitle>Status</HeaderTitle>
        <HeaderValue>
          <StatusLabel status={transaction.status} partiallyFilled={partiallyFilled} />
        </HeaderValue>
      </td>
    </tr>
  )
}

const TransactionTable: React.FC<Props> = (props) => {
  const { transactions, showBorderTable = false } = props
  const [isPriceInverted, setIsPriceInverted] = useState(false)
  useEffect(() => {
    setIsPriceInverted(isPriceInverted)
  }, [isPriceInverted])
  const invertLimitPrice = (): void => {
    setIsPriceInverted((previousValue) => !previousValue)
  }

  const transactionItems = (items: Order[]): JSX.Element => {
    let tableContent
    if (!items || items.length === 0) {
      tableContent = (
        <tr className="row-empty">
          <td className="row-td-empty">
            <EmptyItemWrapper>
              Can&apos;t load details <br /> Please try again
            </EmptyItemWrapper>
          </td>
        </tr>
      )
    } else {
      tableContent = (
        <>
          {items.map((item, i) => (
            <RowTransaction
              key={`${item.shortId}-${i}`}
              invertLimitPrice={invertLimitPrice}
              transaction={item}
              isPriceInverted={isPriceInverted}
            />
          ))}
        </>
      )
    }
    return tableContent
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
