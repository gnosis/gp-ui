import React from 'react'
import styled from 'styled-components'

const CardRowWrapper = styled.div`
  display: flex;
  flex-direction: row !important;
  overflow: auto;
`

export type CardRowProps = { children?: React.ReactElement }

/**
 * CardRow component.
 *
 * Place cards side-by-side
 */
export const CardRow: React.FC<CardRowProps> = ({ children }) => {
  return <CardRowWrapper>{children}</CardRowWrapper>
}
