import React, { useMemo } from 'react'
import styled from 'styled-components'

import { formatSmart, TokenErc20 } from '@gnosis.pm/dex-js'

import { getOrderExecutedAmounts, getOrderFilledAmount, getOrderStatus, RawOrder } from 'api/operator'

import { SimpleTable } from 'components/common/SimpleTable'
import { StatusLabel } from 'components/orders/StatusLabel'
import { OrderPriceDisplay } from '../OrderPriceDisplay'

const Table = styled(SimpleTable)`
  border: 0.1rem solid ${({ theme }): string => theme.borderPrimary};
  border-radius: 0.4rem;

  > tbody > tr {
    grid-template-columns: 16rem auto;

    > td {
      justify-content: flex-start;

      &:first-of-type {
        font-weight: var(--font-weight-bold);
        text-transform: capitalize;

        /* Question mark */
        > svg {
          margin: 0 1rem 0 0;
        }

        /* Column after text on first column */
        ::after {
          content: ':';
        }
      }

      &:last-of-type {
        color: ${({ theme }): string => theme.textPrimary1};
      }
    }
  }
`

// TODO: either use a RichOrder object or transform it here
// TODO: for that we'll need token info (decimals, symbol)
export type Props = { order: RawOrder; buyToken: TokenErc20; sellToken: TokenErc20 }

export function OrderDetails(props: Props): JSX.Element {
  const { order, buyToken, sellToken } = props
  const { uid, owner, kind, partiallyFillable, creationDate, validTo, buyAmount, sellAmount, executedFeeAmount } = order

  const status = useMemo(() => getOrderStatus(order), [order])

  const { amount: filledAmount, percentage: filledPercentage } = useMemo(() => getOrderFilledAmount(order), [order])
  const { executedBuyAmount, executedSellAmount } = useMemo(() => getOrderExecutedAmounts(order), [order])

  return (
    <Table
      body={
        <>
          <tr>
            <td>Order Id</td>
            <td>{uid}</td>
          </tr>
          <tr>
            <td>From</td>
            <td>{owner}</td>
          </tr>
          <tr>
            <td>Status</td>
            <td>
              <StatusLabel status={status} />
            </td>
          </tr>
          <tr>
            <td>Submission Time</td>
            <td>{creationDate}</td>
          </tr>
          <tr>
            <td>Expiration Time</td>
            <td>{new Date(validTo * 1000).toISOString()}</td>
          </tr>
          <tr>
            <td>Type</td>
            <td>
              {kind === 'sell'
                ? `Sell ${sellToken.symbol} for ${buyToken.symbol}`
                : `Buy ${buyToken.symbol} for ${sellToken.symbol}`}
              {partiallyFillable && ' (fill or kill)'}
            </td>
          </tr>
          <tr>
            <td>Sell amount</td>
            <td>{`${formatSmart(sellAmount, sellToken.decimals)} ${sellToken.symbol}`}</td>
          </tr>
          <tr>
            <td>Buy amount</td>
            <td>{`${formatSmart(buyAmount, buyToken.decimals)} ${buyToken.symbol}`}</td>
          </tr>
          <tr>
            <td>Limit Price</td>
            <td>
              <OrderPriceDisplay order={order} buyToken={buyToken} sellToken={sellToken} />
            </td>
          </tr>
          {!partiallyFillable && (
            <>
              <tr>
                <td>Filled</td>
                <td>
                  {kind === 'sell'
                    ? `${formatSmart(filledAmount.toString(), sellToken.decimals)} sold for ${formatSmart(
                        executedBuyAmount.toString(),
                        buyToken.decimals,
                      )} (${filledPercentage.multipliedBy(100)}%)`
                    : `${formatSmart(filledAmount.toString(), buyToken.decimals)} bought for ${formatSmart(
                        executedSellAmount.toString(),
                        sellToken.decimals,
                      )} (${filledPercentage.multipliedBy(100)}%)`}
                </td>
              </tr>
              <tr>
                <td>Gas Fees paid</td>
                <td>{formatSmart(executedFeeAmount, sellToken.decimals)}</td>
              </tr>
            </>
          )}
        </>
      }
    />
  )
}
