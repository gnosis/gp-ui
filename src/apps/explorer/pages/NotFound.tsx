import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { media } from 'theme/styles/media'

import { getNetworkFromId } from '@gnosis.pm/dex-js'
import { useNetworkId } from 'state/network'

const Wrapper = styled.div`
  max-width: 118rem;
  margin: 0 auto;
  padding: 1.6rem;

  ${media.mediumDown} {
    max-width: 94rem;
    flex-flow: column wrap;
  }

  ${media.mobile} {
    max-width: 100%;
  }
`

const Title = styled.h1`
  margin: 3rem 0 2.95rem;
  font-weight: ${({ theme }): string => theme.fontBold};
`

const Content = styled.div`
  font-size: 1.6rem;
  border: 0.1rem solid ${({ theme }): string => theme.borderPrimary};
  padding: 20px;
  border-radius: 0.4rem;
  min-height: 23rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  p {
    line-height: ${({ theme }): string => theme.fontLineHeight};
    overflow-wrap: break-word;
  }
`

const StyledLink = styled(Link)`
  height: 5rem;
  border: 0.1rem solid ${({ theme }): string => theme.borderPrimary};
  border-radius: 0.6rem;
  width: 16rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ theme }): string => theme.white} !important;

  :hover {
    background-color: ${({ theme }): string => theme.greyOpacity};
    text-decoration: none;
  }
`
const NotFound2: React.FC = () => {
  const networkId = useNetworkId() || 1
  const network = networkId !== 1 ? getNetworkFromId(networkId).toLowerCase() : ''

  return (
    <Wrapper>
      <Title>Page not found</Title>
      <Content>
        <p>We&apos;re sorry, the page you requested could not be found.</p>
        <StyledLink to={`/${network}`}>Back Home</StyledLink>
      </Content>
    </Wrapper>
  )
}

export default NotFound2
