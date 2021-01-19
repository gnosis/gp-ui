import React, { useState } from 'react'
import styled from 'styled-components'

// Components
import TabItem from 'components/common/Tabs/TabItem'
import TabContent from 'components/common/Tabs/TabContent'

export interface TabItemType {
  readonly id: number
  readonly title: string
  readonly content: React.ReactNode
  readonly count?: number
}
export interface TabThemeType {
  readonly activeBg: string
  readonly activeBgAlt: string
  readonly inactiveBg: string
  readonly activeText: string
  readonly inactiveText: string
  readonly activeBorder: string
  readonly inactiveBorder: string
  readonly letterSpacing: string
  readonly fontWeight: string
  readonly fontSize: string
  readonly borderRadius: boolean
}
interface Props {
  readonly tabItems: TabItemType[]
  readonly tabTheme: TabThemeType
}

const Wrapper = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
  height: 100%;
  > div {
    display: flex;
    flex-flow: row nowrap;
    padding: 0;
    justify-content: space-between;
    width: 100%;
  }
`

export const DEFAULT_TAB_THEME: TabThemeType = {
  activeBg: '--color-transparent',
  inactiveBg: '--color-transparent',
  activeText: '--color-text-primary',
  inactiveText: '--color-text-secondary2',
  activeBorder: '--color-text-primary',
  inactiveBorder: '--color-text-secondary2',
  fontSize: '--font-size-default',
  activeBgAlt: 'initial',
  letterSpacing: 'initial',
  fontWeight: 'normal',
  borderRadius: false,
}

const Tabs: React.FC<Props> = (props) => {
  const { tabTheme = DEFAULT_TAB_THEME, tabItems } = props

  const [activeTab, setActiveTab] = useState(1)

  return (
    <Wrapper>
      <div role="tablist" className="tablist">
        {tabItems.map(({ id, title, count }) => (
          <TabItem
            key={id}
            id={id}
            title={title}
            onTabClick={setActiveTab}
            isActive={activeTab === id}
            tabTheme={tabTheme}
            count={count}
          />
        ))}
      </div>
      <TabContent tabItems={tabItems} activeTab={activeTab} />
    </Wrapper>
  )
}

export default Tabs

export function getTabTheme(tabStyles: Partial<TabThemeType> = {}): TabThemeType {
  return {
    ...DEFAULT_TAB_THEME,
    ...tabStyles,
  }
}
