import React from 'react'
import { formatDistanceToNowStrict, format } from 'date-fns'

export function DateDisplay({ date }: { date: Date }): JSX.Element {
  const distance = formatDistanceToNowStrict(date, { addSuffix: true })
  const fullLocaleBased = format(date, 'P pp')

  return (
    <span>
      {distance} ({fullLocaleBased})
    </span>
  )
}
