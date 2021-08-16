import React from 'react'
import styled from 'styled-components'

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  p {
    font-size: 14px;
    margin: 0px;
  }
  h3 {
    font-size: 18px;
    margin: 8px 0px;
  }
  span {
    font-weight: bold;
    font-size: 11px;
    margin: 0px;
    &.danger {
      color: ${({ theme }): string => theme.red4} !important;
    }
    &.success {
      color: ${({ theme }): string => theme.green} !important;
    }
  }
  div {
    display: flex;
    flex-direction: column;
    justify-content: center;
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
