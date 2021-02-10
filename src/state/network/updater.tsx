import React from 'react'
import { useLocation } from 'react-router'

export const UpdateNetwork: React.FC = () => {
  const location = useLocation()
  const networkMatchArray = location.pathname.match('^/(rinkeby|xdai)')
  console.log('networkMatchArray', networkMatchArray)

  const network = networkMatchArray && networkMatchArray.length > 0 ? networkMatchArray[1] : 'mainnet'

  console.log('network', network)

  return <div>{network}</div>
}
