import React from 'react'
import styled from 'styled-components'
import { SimpleTable, Props as SimpleTableProps } from 'components/SimpleTable'

const Wrapper = styled(SimpleTable)<SimpleTableProps>`
  > table tr > td {
    /* &:first-of-type,
    &:last-of-type {
      padding: 0 0 0 1rem;
    } */

    &:not(:first-of-type) {
      text-align: right;
    }

    &.long {
      color: var(--color-long);
      border-left: 2px solid var(--color-long);
    }

    &.short {
      color: var(--color-short);
      border-left: 2px solid var(--color-short);
    }
  }
`

const CancelledOrderButton = styled.button`
  appearance: none;
  background: none;
  border: 0;
  color: var(--color-text-primary);
  cursor: pointer;
`

const Header = (
  <tr>
    <th>Side</th>
    <th>Date</th>
    <th>Pair</th>
    <th>Limit price</th>
    <th>Amount WETH</th>
    <th>Filled WETH</th>
    <th>Epxires</th>
    <th>Status</th>
  </tr>
)

export const ActiveOrdersContent: React.FC = () => {
  return (
    <Wrapper header={Header}>
      {[...Array(30).keys()].map((i) => (
        <tr key={i}>
          <td className={i % 2 === 1 ? 'long' : 'short'}>{i % 2 === 1 ? 'Buy' : 'Sell'}</td>
          <td>01-10-2020 17:45:{i}2</td>
          <td>WETH/USDT</td>
          <td>370.96</td>
          <td>
            {i}.0{i}
          </td>
          <td>{i}</td>
          <td>Never</td>
          <td className="action">
            Active <CancelledOrderButton>✕</CancelledOrderButton>
          </td>
        </tr>
      ))}
    </Wrapper>
  )
}
