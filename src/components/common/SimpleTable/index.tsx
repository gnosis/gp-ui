import React, { PropsWithChildren } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div<{ $numColumns?: number }>`
  width: 100%;
  height: 100%;
  position: relative;
  padding: 0;
  font-size: var(--font-size-default);
  background: var(--color-primary);

  > table {
    margin: 0;
    height: calc(100% - 8.8rem);
    padding: 0;
    box-sizing: border-box;
    width: 100%;
    border-spacing: 0;
    display: inline-grid;
    grid-template-areas:
      'head-fixed'
      'body-scrollable';
  }

  > table tr {
    text-align: left;
    padding: 0;
  }

  > table tr > td {
    padding: 0;
    color: var(--color-text-secondary2);
    transition: color 0.1s ease-in-out;
    box-sizing: border-box;
  }

  > table > thead {
    grid-area: head-fixed;
    position: sticky;
    top: 0;
    height: auto;
    display: flex;
    align-items: center;
  }

  > table > thead > tr {
    color: var(--color-text-secondary2);
    display: grid;
    width: calc(100% - 0.6rem);
  }

  > table > thead > tr > th {
    font-weight: var(--font-weight-normal);
    &:not(:first-of-type) {
      text-align: right;
    }
  }

  > table > tbody {
    grid-area: body-scrollable;
    overflow-y: auto;
    overflow-x: hidden;
    height: 100%;
    box-sizing: border-box;
    padding: 0;
  }

  > table > tbody > tr {
    display: grid;
    width: 100%;
    transition: background 0.1s ease-in-out;
    border-bottom: 0.1rem solid var(--color-border);
    &:hover {
      background: var(--color-text-hover);
      > td {
        color: var(--color-text-primary);
      }
    }

    &:last-of-type {
      margin: 0 0 5rem;
    }
  }

  > table > thead > tr > th,
  > table > tbody > tr > td {
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    &:first-of-type {
      padding-left: 1rem;
      justify-content: flex-start;
    }
  }

  > table > thead > tr,
  > table > tbody > tr {
    align-items: center;
    ${({ $numColumns }): string | undefined =>
      $numColumns != undefined ? 'grid-template-columns: repeat(' + $numColumns + ', 1fr)' : undefined}
  }
`

export type Props = PropsWithChildren<{
  header: JSX.Element
  className?: string
  numColumns?: number
}>

export const SimpleTable: React.FC<Props> = ({ header, children, className, numColumns }) => (
  <Wrapper $numColumns={numColumns} className={className}>
    <table>
      <thead>{header}</thead>
      <tbody>{children}</tbody>
    </table>
  </Wrapper>
)
