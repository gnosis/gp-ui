import { createMockHook } from './mockHookContext'
import { Theme } from 'theme'
import { useThemeMode as useThemeModeHook, useThemeManager as useThemeManagerHook } from 'hooks/useThemeManager'

export const useThemeMode = createMockHook<typeof useThemeModeHook>('useThemeMode', Theme.LIGHT)

export const useThemeManager = createMockHook<typeof useThemeManagerHook>('useThemeManager', [
  Theme.LIGHT,
  (): void => {
    console.log('mocked useThemeManager hook')
  },
])
