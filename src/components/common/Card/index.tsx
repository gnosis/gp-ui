import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { variants } from 'styled-theming'

import { COLOURS } from 'styles'
import { Theme } from 'theme'

const {
  white,
  whiteDark,
  blue,
  successLight,
  successDark,
  warningLight,
  warningDark,
  dangerLight,
  dangerDark,
  bgLight,
  bgDark,
  blackLight,
} = COLOURS

const DefaultCard = styled.div`
  height: inherit;
  min-width: 200px;
  min-height: 100px;
  background-color: #f5f5f5;
  border-radius: 10px;
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
      border-top: 3px solid ${white} !important;
      border: 1px solid ${white};
    `,
    [Theme.DARK]: css`
      background: ${bgDark};
      color: ${white};
      border-top: 3px solid ${whiteDark} !important;
      border: 1px solid ${whiteDark};
    `,
  },
  get primary() {
    return this.default
  },
  info: {
    [Theme.LIGHT]: css`
      color: ${blackLight};
      background: ${white};
      border-top: 3px solid ${blue} !important;
      border: 1px solid ${blue};
    `,
    [Theme.DARK]: css`
      color: ${white};
      background: ${bgDark};
      border-top: 3px solid ${blue} !important;
      border: 1px solid ${blue};
    `,
  },
  success: {
    [Theme.LIGHT]: css`
      color: ${blackLight};
      background: ${white};
      border-top: 3px solid ${successLight} !important;
      border: 1px solid ${successLight};
    `,
    [Theme.DARK]: css`
      color: ${white};
      background: ${bgDark};
      border-top: 3px solid ${successDark} !important;
      border: 1px solid ${successDark};
    `,
  },
  danger: {
    [Theme.LIGHT]: css`
      color: ${blackLight};
      background: ${bgLight};
      border-top: 3px solid ${dangerLight} !important;
      border: 1px solid ${dangerLight};
    `,
    [Theme.DARK]: css`
      color: ${white};
      background: ${bgDark};
      border-top: 3px solid ${dangerDark} !important;
      border: 1px solid ${dangerDark};
    `,
  },
  warning: {
    [Theme.LIGHT]: css`
      color: ${blackLight};
      background: ${white};
      border-top: 3px solid ${warningLight} !important;
      border: 1px solid ${warningLight};
    `,
    [Theme.DARK]: css`
      color: ${white};
      background: ${bgDark};
      border-top: 3px solid ${warningDark} !important;
      border: 1px solid ${warningDark};
    `,
  },
})

const StyledCard = styled(DefaultCard)<{ variant: CardStatusVariations }>`
  border-top-width: ${({ variant }): string => (variant == 'default' ? '0px' : '3px')} !important;
  /* Fold in theme css above */
  ${CardTheme}
`

const CardComponent = styled(StyledCard)<{ $hideHeader?: boolean; variant?: string; outline?: boolean }>`
  display: flex;
  flex-direction: column;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  border-width: ${({ outline }): string => (outline ? '1px' : '0px')};
`

// CARD CONTENT STYLES
const CardContent = styled.div<{ $hideHeader: boolean }>`
  flex: 1;
  border-top-right-radius: ${({ $hideHeader }): string => ($hideHeader ? '10px' : '0px')};
  border-top-left-radius: ${({ $hideHeader }): string => ($hideHeader ? '10px' : '0px')};
  font-size: 15px;
  padding: 5px 10px 5px 10px;
  line-height: normal;
`

// CARD HEADER STYLES
const StyledCardHeader = styled.div`
  padding: 15px 10px 15px 10px;
  margin: 0px;
  min-height: 30px;
  width: inherit;
  background: rgb(128 128 128 / 14%);
  backdrop-filter: blur(5px);
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
`
const CardHeader = styled(StyledCardHeader)<{ $hideHeader: boolean }>`
  font-size: 18px;
  display: ${({ $hideHeader }): string => ($hideHeader ? 'none' : 'block')};
`
// CARD FOOTER STYLES
const StyledCardFooter = styled.div`
  padding: 15px 10px 15px 10px;
  margin: 0px;
  min-height: 30px;
  width: inherit;
  background: rgb(128 128 128 / 14%);
  backdrop-filter: blur(5px);
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
`
const CardFooter = styled(StyledCardFooter)<{ $hideFooter: boolean }>`
  font-size: 13px;
  display: ${({ $hideFooter }): string => ($hideFooter ? 'none' : 'block')};
`

export type CardStatusVariations = 'default' | 'success' | 'info' | 'warning' | 'danger'

export interface CardBaseProps {
  variant?: CardStatusVariations
  outline?: boolean
  title?: string
  footer?: string
  children?: React.ReactElement
}

/**
 * Card component.
 *
 * An extensible content container which is highly customizable with headers and footers.
 * It also features a variety of status and theme contexts
 */
export const Card: React.FC<
  CardBaseProps & {
    variant?: CardStatusVariations
    footer?: string
    outline?: boolean
  }
> = ({ footer, variant, title, children, outline, ...rest }) => {
  const [hideHeader, setHideHeader] = useState(true)
  const [hideFooter, setHideFooter] = useState(true)

  useEffect(() => setHideHeader(!(title != null && typeof title == 'string' && title.trim().length > 0)), [title])
  useEffect(() => setHideFooter(footer == null || typeof footer !== 'string' || footer.length == 0), [footer])

  return (
    <CardComponent {...rest} $hideHeader={hideHeader} variant={variant || 'default'} outline={outline || false}>
      <CardHeader $hideHeader={hideHeader}>{title}</CardHeader>
      <CardContent $hideHeader={hideHeader}>{children}</CardContent>
      <CardFooter $hideFooter={hideFooter}>{footer}</CardFooter>
    </CardComponent>
  )
}
