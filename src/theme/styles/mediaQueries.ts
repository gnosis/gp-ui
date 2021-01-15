import { ThemedCssFunction, DefaultTheme, CSSObject, FlattenSimpleInterpolation, css } from 'styled-components'

const MEDIA_WIDTHS = {
  upToExtraSmall: 500,
  upToSmall: 720,
  upToMedium: 960,
  upToLarge: 1280,
}

type MediaWidthKeys = keyof typeof MEDIA_WIDTHS

type MediaWidth = {
  [key in MediaWidthKeys]: ThemedCssFunction<DefaultTheme>
}

export const mediaWidthTemplates = Object.keys(MEDIA_WIDTHS).reduce<MediaWidth>((accumulator, size: unknown) => {
  ;(accumulator[size as MediaWidthKeys] as unknown) = (
    a: CSSObject,
    b: CSSObject,
    c: CSSObject,
  ): ThemedCssFunction<DefaultTheme> | FlattenSimpleInterpolation => css`
    @media (max-width: ${MEDIA_WIDTHS[size as MediaWidthKeys]}px) {
      ${css(a, b, c)}
    }
  `
  return accumulator
}, {} as MediaWidth)
