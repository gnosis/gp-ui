import React from 'react'
import styled from 'styled-components'

import { Order } from 'api/operator'

import StyledUserDetailsTable, { StyledUserDetailsTableProps } from './styled'
import { DateDisplay } from 'components/orders/DateDisplay'
import { RowWithCopyButton } from 'components/orders/RowWithCopyButton'
import { TokenDisplay } from 'components/common/TokenDisplay'
import { formatSmartMaxPrecision } from 'utils'
import { TokenErc20 } from '@gnosis.pm/dex-js'
import BigNumber from 'bignumber.js'
import { StatusLabel } from '../StatusLabel'
import { Network } from 'types'

const Wrapper = styled(StyledUserDetailsTable)`
  > thead > tr,
  > tbody > tr {
    grid-template-columns: 12rem 17rem repeat(4, 13rem) 1fr;
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

  return `${formattedAmount(order.sellToken, order.sellAmount)} ${order.sellToken?.symbol} per ${
    order.sellToken?.symbol
  }`
}

export type Props = StyledUserDetailsTableProps & {
  orders: Order[]
}

const OrdersUserDetailsTable: React.FC<Props> = (props) => {
  const { orders, showBorderTable = false } = props
  const network = Network.Mainnet

  const orderItems = (items: Order[]): JSX.Element => {
    return (
      <>
        {items.map((item) => (
          <tr key={item.shortId}>
            <td>
              {
                <RowWithCopyButton
                  className="span-copybtn-wrap"
                  textToCopy={item.uid}
                  contentsToDisplay={item.shortId}
                />
              }
            </td>
            <td className="cell-kind-operation">
              {item.kind} {<TokenDisplay erc20={item.sellToken as TokenErc20} network={network} />}
              for {<TokenDisplay erc20={item.buyToken as TokenErc20} network={network} />}
            </td>
            <td>
              {formattedAmount(item.sellToken, item.sellAmount)} {item.sellToken?.symbol}
            </td>
            <td>
              {formattedAmount(item.buyToken, item.buyAmount)} {item.buyToken?.symbol}
            </td>
            <td>{getLimitPrice(item)}</td>
            <td>
              <StatusLabel status={item.status} partiallyFilled={item.partiallyFilled} />
            </td>
            <td>
              <DateDisplay date={item.creationDate} />
            </td>
          </tr>
        ))}
      </>
    )
  }

  return (
    <Wrapper
      showBorderTable={showBorderTable}
      header={
        <tr>
          <th>Order ID</th>
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
