import React from 'react'
import styled from 'styled-components'
import { TabThemeType } from 'components/common/Tabs/Tabs'
import { ButtonBase } from '../Button'

interface TabProps {
  title: string
  isActive: boolean
  readonly id: number
  readonly count?: number
  readonly tabTheme: TabThemeType
  onTabClick: (id: number) => void
}

interface TabItemWrapperProps {
  isActive: boolean
  readonly tabTheme: TabThemeType
}

const TabItemBase = styled(ButtonBase)`
  display: flex;
  flex: 1 1 0;
  align-items: center;
  justify-content: center;

  border: 0;
  /* TODO: move this into baseStyles or sth similar */
  height: var(--height-button-default);

  text-align: center;

  appearance: none;
`

// TODO: replace with DefaultTheme and remove `var` approach
// Make Tabs and TabItem it's own common component with theme
const TabItemWrapper = styled(TabItemBase)<TabItemWrapperProps>`
  background: ${({ isActive, tabTheme }): string => `var(${isActive ? tabTheme.activeBg : tabTheme.inactiveBg})`};
  color: ${({ isActive, tabTheme }): string =>
    isActive ? `var(${tabTheme.activeText})` : `var(${tabTheme.inactiveText})`};

  font-weight: ${({ tabTheme }): string => tabTheme.fontWeight};
  font-size: ${({ tabTheme }): string => tabTheme.fontSize};
  letter-spacing: ${({ tabTheme }): string => tabTheme.letterSpacing};

  border-bottom: ${({ isActive, tabTheme }): string =>
    `.1rem solid var(${isActive ? tabTheme.activeBorder : tabTheme.inactiveBorder})`};

  /* TODO: Provide alternative :focus styling because of using outline: 0; */

  &:first-of-type {
    border-top-left-radius: ${({ tabTheme }): string =>
      `${!tabTheme.borderRadius ? '0' : 'var(--border-radius-default)'}`};
    border-bottom-left-radius: ${({ tabTheme }): string =>
      `${!tabTheme.borderRadius ? '0' : 'var(--border-radius-default)'}`};
  }

  &:last-of-type {
    border-top-right-radius: ${({ tabTheme }): string =>
      `${!tabTheme.borderRadius ? '0' : 'var(--border-radius-default)'}`};
    border-bottom-right-radius: ${({ tabTheme }): string =>
      `${!tabTheme.borderRadius ? '0' : 'var(--border-radius-default)'}`};
    ${({ isActive, tabTheme }): string | false => isActive && `background: var(${tabTheme.activeBgAlt});`}
  }
`

const TabItem: React.FC<TabProps> = (props) => {
  const { onTabClick, id, title, isActive, tabTheme } = props

  return (
    <TabItemWrapper
      role="tab"
      aria-selected={isActive}
      isActive={isActive}
      onClick={(): void => onTabClick(id)}
      tabTheme={tabTheme}
    >
      {title}
    </TabItemWrapper>
  )
}

export default TabItem
