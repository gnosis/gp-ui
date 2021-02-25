import 'inter-ui'

import { Theme } from 'theme'
import { logDebug } from 'utils'
export interface Fonts {
  fontDefault: string
  fontVariable: string
  fontNormal: string
  fontMedium: string
  fontBold: string
}

const fontsVariables = {
  fontDefault: 'Inter',
  fontVariable: 'Inter var',
  fontNormal: '400',
  fontMedium: '500',
  fontBold: '700',
}

export function getFonts(mode: Theme): Fonts {
  logDebug(`[THEME] Loading ${mode} theme font`)
  return fontsVariables
}
