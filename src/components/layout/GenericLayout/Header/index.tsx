import React, { PropsWithChildren } from 'react'
import styled from 'styled-components'
import { media } from 'theme/styles/media'

import { Link } from 'react-router-dom'

// Assets
import LogoImage from 'assets/img/logo-v2.svg'

const HeaderStyled = styled.header`
  height: auto;
  margin: 2.2rem auto 0;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 0 1.6rem;
  max-width: 140rem;

  ${media.mediumDown} {
    max-width: 94rem;
  }

  ${media.mobile} {
    max-width: 100%;
  }
`

const HeaderLink = styled(Link)`
  display: flex;
  align-content: center;
  justify-content: center;
`

const Logo = styled.span`
  width: 2.8rem;
  height: 2.8rem;
  transform: perspective(20rem) rotateY(0);
  transform-style: preserve-3d;
  transition: transform 1s ease-in-out;
  padding: 0;
  margin: 0 1rem 0 0;

  &:hover {
    animation-name: spin;
    animation-duration: 4s;
    animation-iteration-count: infinite;
    animation-delay: 0.3s;
    text-decoration: none;
  }

  > img {
    background: url(${LogoImage}) no-repeat center/contain;
    border: 0;
    object-fit: contain;
    width: inherit;
    height: inherit;
    margin: auto;
  }

  @keyframes spin {
    0% {
      transform: perspective(20rem) rotateY(0);
    }
    30% {
      transform: perspective(20rem) rotateY(200deg);
    }
    100% {
      transform: perspective(20rem) rotateY(720deg);
    }
  }
`

type Props = PropsWithChildren<{ linkTo?: string; logoAlt?: string }>

export const Header: React.FC<Props> = ({ children, linkTo, logoAlt }) => (
  <HeaderStyled>
    <HeaderLink to={linkTo || '/'}>
      <Logo>
        <img src={LogoImage} alt={logoAlt || 'Trading interface homepage'} />
      </Logo>
      {children}
    </HeaderLink>
  </HeaderStyled>
)
