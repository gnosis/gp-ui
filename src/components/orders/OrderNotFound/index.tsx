import React from 'react'
import { useParams } from 'react-router'
import styled from 'styled-components'
import { Search } from 'components/orders/Search'
import SupportIcon from 'assets/img/support.png'
import { MEDIA } from 'const'

const Title = styled.h1`
  margin: 0.55rem 0 2.5rem;
  font-weight: ${({ theme }): string => theme.fontBold};
`

const Content = styled.div`
  font-size: 16px;
  border: 0.1rem solid ${({ theme }): string => theme.borderPrimary};
  padding: 20px;
  border-radius: 0.4rem;

  p {
    line-height: ${({ theme }): string => theme.fontLineHeight};
    overflow-wrap: break-word;
  }
`

const SearchSection = styled.div`
  margin-top: 6rem;
`

const SearchContent = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;
  gap: 2.5rem;

  @media ${MEDIA.mobile} {
    flex-flow: column wrap;
    gap: 1rem;

    form {
      width: 100%;
    }
  }
`

const Support = styled.a`
  height: 5rem;
  border: 1px solid ${({ theme }): string => theme.borderPrimary};
  border-radius: 0.6rem;
  width: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  cursor: pointer;
  color: ${({ theme }): string => theme.white} !important;

  :hover {
    background-color: ${({ theme }): string => theme.bg2};
    text-decoration: none;
  }
`

export const OrderNotFound: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>()

  return (
    <>
      <Title>Order not found</Title>
      <Content>
        <p>
          Sorry, no matches found for: <strong>&quot;{orderId}&quot;</strong>
        </p>
        <SearchSection>
          <Title>Search again by Order ID</Title>
          <SearchContent>
            <Search />
            <p>or</p>
            <Support href="https://chat.gnosis.io/" target="_blank" rel="noopener noreferrer">
              Get Support
              <img src={SupportIcon} />
            </Support>
          </SearchContent>
        </SearchSection>
      </Content>
    </>
  )
}
