import React from 'react'
import styled, { css } from 'styled-components'
import { variants } from 'styled-theming'

import { COLOURS } from 'styles'
import { Theme } from 'theme'

const { white, whiteDark, fadedGreyishWhite, blackLight } = COLOURS

const DefaultCard = styled.div`
  height: inherit;
  min-width: 200px;
  min-height: 100px;
  background-color: #f5f5f5;
  border-radius: 6px;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 7%), 0 4px 6px -2px rgb(0 0 0 / 5%);
  margin: 10px;
`
// Create our variated Card Theme
// 'variant' refers to a prop on button
// <CardBase variant="danger" />
export const CardTheme = variants('mode', 'variant', {
  default: {
    [Theme.LIGHT]: css`
      background: ${white};
      color: ${blackLight};
      border: 1px solid ${white};
    `,
    [Theme.DARK]: css`
      background: ${fadedGreyishWhite};
      color: ${white};
      border: 1px solid ${whiteDark};
    `,
  },
  get primary() {
    return this.default
  },
})

const StyledCard = styled(DefaultCard)`
  /* Fold in theme css above */
  ${CardTheme}
`

const CardComponent = styled(StyledCard)<{ outline?: boolean }>`
  display: flex;
  flex-direction: column;
  border-top-right-radius: 6px;
  border-top-left-radius: 6px;
  border-width: ${({ outline }): string => (outline ? '1px' : '0px')};
`

// CARD CONTENT STYLES
const CardContent = styled.div`
  flex: 1;
  border-top-right-radius: 6px;
  border-top-left-radius: 6px;
  font-size: 15px;
  padding: 5px 10px 5px 10px;
  line-height: normal;
`

export interface CardBaseProps {
  outline?: boolean
  children?: React.ReactElement
}

/**
 * Card component.
 *
 * An extensible content container.
 */
export const Card: React.FC<
  CardBaseProps & {
    outline?: boolean
  }
> = ({ children, outline, ...rest }) => {
  return (
    <CardComponent {...rest} variant={'default'} outline={outline || false}>
      <CardContent>{children}</CardContent>
    </CardComponent>
  )
}
