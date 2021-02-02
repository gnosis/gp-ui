import React, { useMemo } from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faClock, faDotCircle } from '@fortawesome/free-solid-svg-icons'

import { OrderStatus } from 'api/operator'

export type Props = { status: OrderStatus }

const Wrapper = styled.div<Props>`
  font-size: ${({ theme }): string => theme.fontSizeNormal};
  font-weight: ${({ theme }): string => theme.fontWeightBold};
  text-transform: capitalize;

  border-radius: 4px;

  padding: 0.75em;
  display: inline-block;

  & > svg {
    margin: 0 0.75rem 0 0;
  }

  ${({ theme, status }): string => {
    // TODO: move all colors to theme
    let background, color

    switch (status) {
      case 'expired':
        color = '#DB843A'
        background = 'rgba(219, 132, 58, 0.1)'
        break
      case 'filled':
      case 'partially filled':
        color = '#41C29B'
        background = 'rgba(0, 216, 151, 0.1)'
        break
      case 'open':
        // light theme
        // color = '#77838F'
        // background = 'rgba(119, 131, 143, 0.1)'
        // dark theme
        color = '#FFFFFF'
        background = 'rgba(151, 151, 184, 0.3)'
        break
    }
    return `
      background: ${background};
      color: ${color};
    `
  }}
`

export const StatusLabel = (props: Props): JSX.Element => {
  const { status } = props

  const icon = useMemo(() => {
    switch (status) {
      case 'expired':
        return <FontAwesomeIcon icon={faClock} />
      case 'filled':
      case 'partially filled':
        return <FontAwesomeIcon icon={faCheckCircle} />
      case 'open':
        return <FontAwesomeIcon icon={faDotCircle} />
    }
  }, [status])

  return (
    <Wrapper status={status}>
      {icon}
      {status}
    </Wrapper>
  )
}
