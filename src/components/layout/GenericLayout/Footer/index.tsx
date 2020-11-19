import React from 'react'
import styled from 'styled-components'
// import { Link } from 'react-router-dom'
import { depositApi } from 'api'

// Components
import { BlockExplorerLink } from 'components/common/BlockExplorerLink'

// Hooks
import { useWalletConnection } from 'hooks/useWalletConnection'

// Config
import { footerConfig } from '../Footer/config'

const FooterStyled = styled.footer`
  height: 6.2rem;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 0 2rem;
  border: 0.1rem solid var(--color-border);
`

const LinkWrapper = styled(BlockExplorerLink)`
  margin: 0;
  text-align: center;
  border: 0.1rem solid #c5d3e0;
  font-weight: var(--font-weight-bold);
  font-size: 13px;
  color: inherit;
  letter-spacing: 0;
  text-decoration: none;
  padding: 1.4rem 2rem;
  box-sizing: border-box;
  border-radius: 6rem;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    border: 0.1rem solid #29a745;
  }
`

export interface FooterType {
  readonly verifiedText?: string
  readonly isBeta?: boolean
  readonly url?: {
    readonly web: string
    readonly appId: string
    readonly contracts: string
  }
}

export const Footer: React.FC<FooterType> = () => {
  const { verifiedText, isBeta, url } = footerConfig
  const { networkIdOrDefault: networkId } = useWalletConnection()
  const contractAddress = depositApi.getContractAddress(networkId)

  return (
    <FooterStyled>
      {isBeta && 'This project is in beta. Use at your own risk.'}
      {contractAddress && networkId ? (
        <LinkWrapper
          type="contract"
          identifier={contractAddress}
          networkId={networkId}
          label={verifiedText ? verifiedText : 'View contract'}
        />
      ) : (
        ''
      )}
      {url.web && VERSION ? (
        <a target="_blank" rel="noopener noreferrer" href={url.web + VERSION}>
          Web: v{VERSION}
        </a>
      ) : (
        ''
      )}
      {url.appId && CONFIG.appId ? (
        <a target="_blank" rel="noopener noreferrer" href={url.appId}>
          App Id: {CONFIG.appId}
        </a>
      ) : (
        ''
      )}
      {url.contracts && CONTRACT_VERSION ? (
        <a target="_blank" rel="noopener noreferrer" href={url.contracts + CONTRACT_VERSION}>
          Contracts: v{CONTRACT_VERSION}
        </a>
      ) : (
        ''
      )}
    </FooterStyled>
  )
}
