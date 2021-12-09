import React, { useRef, useState } from 'react'
import { useHistory } from 'react-router'
import { useLocation } from 'react-router-dom'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { SelectorContainer, OptionsContainer, Option, NetworkLabel, StyledFAIcon } from './NetworkSelector.styled'
import { replaceURL } from 'utils/url'
import { Network } from 'types'

type networkSelectorProps = {
  networkId: number
}

type NetworkOptions = {
  id: Network
  name: string
  url: string
}

const networkOptions: NetworkOptions[] = [
  {
    id: Network.Mainnet,
    name: 'Ethereum Mainnet',
    url: 'mainnet',
  },
  {
    id: Network.Rinkeby,
    name: 'Rinkeby',
    url: 'rinkeby',
  },
  {
    id: Network.xDAI,
    name: 'xDAI',
    url: 'xdai',
  },
]

export const NetworkSelector: React.FC<networkSelectorProps> = ({ networkId }) => {
  const selectContainer = useRef<HTMLInputElement>(null)
  const history = useHistory()
  const location = useLocation()
  const name = networkOptions.find((network) => network.id === networkId)?.name.toLowerCase()
  const [open, setOpen] = useState(false)

  const redirectToNetwork = (newNetwork: string, currentNetwork: number): void => {
    console.log('alla')
    history.push(
      replaceURL(currentNetwork === Network.Mainnet ? `/mainnet${location.pathname}` : location.pathname, newNetwork),
    )
  }

  return (
    <SelectorContainer ref={selectContainer} onClick={(): void => setOpen(!open)}>
      <NetworkLabel className={name}>{name}</NetworkLabel>
      <span className={`arrow ${open && 'open'}`} />
      {open && (
        <OptionsContainer width={selectContainer.current?.offsetWidth || 0}>
          {networkOptions.map((network) => (
            <Option onClick={(): void => redirectToNetwork(network.url, networkId)} key={network.id}>
              <div className={`dot ${network.name.toLowerCase()} `} />
              <div className={`name ${network.id === networkId && 'selected'}`}>{network.name}</div>
              {network.id === networkId && <StyledFAIcon icon={faCheck} />}
            </Option>
          ))}
        </OptionsContainer>
      )}
    </SelectorContainer>
  )
}

export default NetworkSelector
