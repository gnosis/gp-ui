import React from 'react'
import styled from 'styled-components'
import { media } from 'theme/styles/media'
import { Search } from 'apps/explorer/components/common/Search'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-flow: column wrap;
  height: calc(100vh - 15rem);
  padding: 1.6rem;
  margin: 0 auto;
  width: 100%;
  max-width: 140rem;

  ${media.mediumDown} {
    max-width: 94rem;
  }

  ${media.mobile} {
    max-width: 100%;
  }

  > h1 {
    display: flex;
    padding: 2.4rem 0 0.75rem;
    align-items: center;
    justify-content: center;
    font-weight: ${({ theme }): string => theme.fontBold};
    width: 100%;
    margin: 0 0 2.4rem;
    font-size: 2.4rem;
  }
`

export const Home: React.FC = () => {
  return (
    <Wrapper>
      <h1>Search Order ID</h1>
      <Search />
    </Wrapper>
  )
}

export default Home
