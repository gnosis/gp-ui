import { Colors, Fonts } from './styles'

export enum Theme {
  DARK = 'DARK',
  LIGHT = 'LIGHT',
}

export const THEME_LIST = Object.entries(Theme)

declare module 'styled-components' {
  export interface DefaultTheme extends Colors, Fonts {
    // theming
    mode: Theme
    // used to key in on component variants
    componentKey?: keyof JSX.IntrinsicElements
    // Media query templates
    // can be used like:
    /* 
    theme.mediaQueries.upToSmall`
      font-size: 2rem;
      margin: 0;
    `
    */
    mediaQueries: {
      upToExtraSmall: ThemedCssFunction<DefaultTheme>
      upToSmall: ThemedCssFunction<DefaultTheme>
      upToMedium: ThemedCssFunction<DefaultTheme>
      upToLarge: ThemedCssFunction<DefaultTheme>
    }
  }
}
