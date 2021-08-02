import React from 'react'
import styled from 'styled-components'

const CardRowWrapper = styled.div<{ overflow: boolean }>`
  display: flex;
  flex-direction: row !important;
  overflow: ${({ overflow }): string => (overflow ? 'auto' : 'hidden')};
`

export type CardRowProps = { overflow?: boolean; children?: React.ReactElement }

/**
 * CardRow component.
 *
 * Place cards side-by-side
 */
export const CardRow: React.FC<
  CardRowProps & {
    overflow?: boolean
  }
> = ({ children, overflow }) => {
  return <CardRowWrapper overflow={overflow || false}>{children}</CardRowWrapper>
}
