import React from 'react'
import styled from 'styled-components'

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  p {
    font-size: 15px;
    margin-bottom: 0px;
  }
  h3 {
    font-size: 20px;
    margin: 2px 3px -1px 3px;
  }
  span {
    font-weight: bold;
    font-size: 12px;
    margin: 2px 1px 2px 0px;
    &.danger {
      color: ${({ theme }): string => theme.red4} !important;
    }
    &.success {
      color: ${({ theme }): string => theme.green} !important;
    }
  }
  div {
    margin-top: 5px;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
  }
`
export type statusType = 'success' | 'danger'

export interface CardContentProps {
  label: string
  value: string
  hint?: string
  status?: statusType
}

/**
 * Card component.
 *
 * An extensible content container.
 */
export const CardContent: React.FC<CardContentProps> = ({ label, value, hint, status, ...rest }): JSX.Element => {
  return (
    <CardBody {...rest}>
      <p>{label}</p>
      <div>
        <h3>{value}</h3>
        {hint && <span className={status ?? 'success'}>{hint}</span>}
      </div>
    </CardBody>
  )
}
