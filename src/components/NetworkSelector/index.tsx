import React, { useEffect, useRef, useState } from 'react'
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
    name: 'Ethereum',
    url: 'mainnet',
  },
  {
    id: Network.xDAI,
    name: 'xDAI',
    url: 'xdai',
  },
  {
    id: Network.Rinkeby,
    name: 'Rinkeby',
    url: 'rinkeby',
  },
]

export const NetworkSelector: React.FC<networkSelectorProps> = ({ networkId }) => {
  const selectContainer = useRef<HTMLInputElement>(null)
  const history = useHistory()
  const location = useLocation()
  const name = networkOptions.find((network) => network.id === networkId)?.name.toLowerCase()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const closeOpenSelector = (e: MouseEvent): void => {
      if (selectContainer.current && open && !selectContainer.current.contains(e.target as HTMLElement)) {
        setOpen(false)
      }
    }

    window.addEventListener('mousedown', closeOpenSelector)

    return (): void => window.removeEventListener('mousedown', closeOpenSelector)
  }, [open])

  const redirectToNetwork = (newNetwork: string, currentNetwork: number): void =>
    history.push(
      replaceURL(currentNetwork === Network.Mainnet ? `/mainnet${location.pathname}` : location.pathname, newNetwork),
    )

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
