import React, { useState } from 'react'
import styled from 'styled-components'
import { MEDIA } from 'const'

// Components
import TabItem from 'components/common/Tabs/TabItem'
import TabContent from 'components/common/Tabs/TabContent'

type TabId = number
export enum IndicatorTabSize {
  small = 0.1,
  big = 0.2,
}
export type TabBarExtraContent = React.ReactNode

export interface TabItemInterface {
  readonly tab: React.ReactNode
  readonly content: React.ReactNode
  readonly id: TabId
}

export interface TabTheme {
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
  readonly indicatorTabSize: IndicatorTabSize
}
export interface Props {
  readonly tabItems: TabItemInterface[]
  readonly tabTheme: TabTheme
  readonly defaultTab?: TabId
  readonly extra?: TabBarExtraContent
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
  .tab-extra-content {
    width: 100%;

    @media ${MEDIA.mobile} {
      color: red; /* mobile css here */
    }
  }
`

export const DEFAULT_TAB_THEME: TabTheme = {
  activeBg: 'var(--color-transparent)',
  activeBgAlt: 'initial',
  inactiveBg: 'var(--color-transparent)',
  activeText: 'var(--color-text-primary)',
  inactiveText: 'var(--color-text-secondary2)',
  activeBorder: 'var(--color-text-primary)',
  inactiveBorder: 'none',
  fontSize: 'var(--font-size-default)',
  fontWeight: 'var(--font-weight-normal)',
  letterSpacing: 'initial',
  borderRadius: false,
  indicatorTabSize: IndicatorTabSize.small,
}

interface ExtraContentProps {
  extra?: TabBarExtraContent
}

const ExtraContent = ({ extra }: ExtraContentProps): JSX.Element | null => {
  if (!extra) return null

  console.log('ExtraContent', extra)
  return <div className="tab-extra-content">{extra}</div>
}

const Tabs: React.FC<Props> = (props) => {
  const { tabTheme = DEFAULT_TAB_THEME, tabItems, defaultTab = 1, extra: tabBarExtraContent } = props

  const [activeTab, setActiveTab] = useState(defaultTab)

  return (
    <Wrapper>
      <div role="tablist" className="tablist">
        {tabItems.map(({ tab, id }) => (
          <TabItem
            key={id}
            id={id}
            tab={tab}
            onTabClick={setActiveTab}
            isActive={activeTab === id}
            tabTheme={tabTheme}
          />
        ))}
        <ExtraContent extra={tabBarExtraContent} />
      </div>
      <TabContent tabItems={tabItems} activeTab={activeTab} />
    </Wrapper>
  )
}

export default Tabs

export function getTabTheme(tabStyles: Partial<TabTheme> = {}): TabTheme {
  return {
    ...DEFAULT_TAB_THEME,
    ...tabStyles,
  }
}
