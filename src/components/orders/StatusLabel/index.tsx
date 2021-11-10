import React from 'react'
import styled, { DefaultTheme, css, keyframes, FlattenSimpleInterpolation } from 'styled-components'
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import {
  faCheckCircle,
  faCircleNotch,
  faClock,
  faTimesCircle,
  IconDefinition,
  faKey,
} from '@fortawesome/free-solid-svg-icons'

import { OrderStatus } from 'api/operator'

type DisplayProps = { status: OrderStatus }

function setStatusColors({ theme, status }: { theme: DefaultTheme; status: OrderStatus }): string {
  let background, text

  switch (status) {
    case 'expired':
    case 'cancelled':
      text = theme.orange
      background = theme.orangeOpacity
      break
    case 'filled':
      text = theme.green
      background = theme.greenOpacity
      break
    case 'open':
    case 'signature pending':
      text = theme.labelTextOpen
      background = theme.labelBgOpen
      break
  }

  return `
      background: ${background};
      color: ${text};
    `
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: ${({ theme }): string => theme.fontSizeDefault};
`

const Label = styled.div<DisplayProps>`
  font-weight: ${({ theme }): string => theme.fontBold};
  text-transform: capitalize;
  border-radius: 0.4rem;
  line-height: 1;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  ${({ theme, status }): string => setStatusColors({ theme, status })}
`

const frameAnimation = keyframes`
    100% {
      -webkit-mask-position: left;
    }
`
type StyledFAIconProps = FontAwesomeIconProps & {
  $shimming?: boolean
}

const StyledFAIcon = styled(FontAwesomeIcon)<StyledFAIconProps>`
  margin: 0 0.75rem 0 0;
  ${(props): FlattenSimpleInterpolation | null =>
    props.$shimming
      ? css`
          display: inline-block;
          -webkit-mask: linear-gradient(-60deg, #000 30%, #0005, #000 70%) right/300% 100%;
          mask: linear-gradient(-60deg, #000 30%, #0005, #000 70%) right/300% 100%;
          background-repeat: no-repeat;
          animation: shimmer 1.5s infinite;
          animation-name: ${frameAnimation};
        `
      : null}
`

const PartialFill = styled.div`
  margin-left: 1rem;
  font-size: 0.85em; /* Intentional use of "em" to be relative to parent's font size */
  color: ${({ theme }): string => theme.textPrimary1};
`

function getStatusIcon(status: OrderStatus): IconDefinition {
  switch (status) {
    case 'expired':
      return faClock
    case 'filled':
      return faCheckCircle
    case 'cancelled':
      return faTimesCircle
    case 'signature pending':
      return faKey
    case 'open':
      return faCircleNotch
  }
}

function StatusIcon({ status }: DisplayProps): JSX.Element {
  const icon = getStatusIcon(status)
  const isOpen = status === 'open'
  const shimming = status === 'signature pending'

  return <StyledFAIcon icon={icon} spin={isOpen} $shimming={shimming} />
}

export type Props = DisplayProps & { partiallyFilled: boolean }

export function StatusLabel(props: Props): JSX.Element {
  const { status, partiallyFilled } = props

  return (
    <Wrapper>
      <Label status={status}>
        <StatusIcon status={status} />
        {status}
      </Label>
      {partiallyFilled && <PartialFill>(partial fill)</PartialFill>}
    </Wrapper>
  )
}
