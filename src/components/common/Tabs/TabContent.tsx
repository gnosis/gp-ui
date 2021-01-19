import React, { useMemo } from 'react'
import { TabItemType } from 'components/common/Tabs/Tabs'

type Props = {
  tabItems: TabItemType[]
  activeTab: number
}

const TabContent: React.FC<Props> = (props) => {
  const { tabItems, activeTab } = props
  const displayTab = useMemo(() => tabItems.find((tab) => tab.id === activeTab), [activeTab, tabItems])

  if (!displayTab) return null

  return <div>{displayTab.content}</div>
}

export default TabContent
