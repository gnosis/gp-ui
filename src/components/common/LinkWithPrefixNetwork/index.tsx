import React from 'react'
import { Link, LinkProps } from 'react-router-dom'

import { MatchPrefixNetworkOnPathname } from 'state/network'

export function LinkWithPrefixNetwork(props: LinkProps): JSX.Element {
  const { to, children, ...otherParams } = props
  const pathMatchArray = MatchPrefixNetworkOnPathname()
  const prefixNetwork = pathMatchArray && pathMatchArray[1]
  let _to = to

  if (prefixNetwork) {
    _to = `/${prefixNetwork}` + _to
  }

  return (
    <Link to={_to} {...otherParams}>
      {children}
    </Link>
  )
}
