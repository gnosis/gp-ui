import React, { useEffect, useState } from 'react'
import { SummaryCards } from './SummaryCards'

import summaryData from './summaryGraphResp.json'

interface TotalSummary {
  batchInfo: { lastBatchDate: string; batchId: string }
  dailyTransactions: { now: number; before: string }
  totalTokens: number
  dailyFees: { now: string; before: string }
  monthSurplus: string
}

export type TotalSummaryResponse = TotalSummary

function useGetTotalSummary(): TotalSummaryResponse {
  const [summary, setSummary] = useState<TotalSummaryResponse>({
    batchInfo: { lastBatchDate: '', batchId: '' },
    dailyTransactions: { now: 0, before: '' },
    totalTokens: 0,
    dailyFees: { now: '', before: '' },
    monthSurplus: '',
  })

  useEffect(() => {
    setSummary({ ...summaryData })
  }, [])

  return summary
}

export function SummaryCardsWidget(): JSX.Element {
  const summary = useGetTotalSummary()

  return <SummaryCards summaryData={summary} />
}
