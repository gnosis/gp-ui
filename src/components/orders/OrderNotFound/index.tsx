import React from 'react'
import { useParams } from 'react-router'
import styled from 'styled-components'
import { Search } from 'components/orders/Search'
import SupportIcon from 'assets/img/support.png'

const Wrapper = styled.div`
  font-size: 14px;
`

const Title = styled.h1`
  font-size: 16px;
  padding: 2.4rem 0 2.35rem;
  font-weight: ${({ theme }): string => theme.fontBold};
`

const Content = styled.div`
  font-size: 14px;
  border: 0.1rem solid ${({ theme }): string => theme.borderPrimary};
  padding: 20px;
  border-radius: 0.4rem;
`

const Errors = styled.div`
  padding: 1rem 1rem 2rem;
  background: #36080847;
  margin-top: 3rem;
  width: 600px;
  border-radius: 0.4rem;
`

const ErrorItem = styled.div`
  margin-left: 1rem;
`

const SearchSection = styled.div`
  margin-top: 6rem;
  cursor: pointer;
`

const SearchContent = styled.div`
  display: flex;
`

const Support = styled.a`
  height: 5rem;
  border: 1px solid ${({ theme }): string => theme.borderPrimary};
  border-radius: 4px;
  width: 150px;
  display: flex;
  align-items: center;
  justify-content: center;

  :hover {
    background-color: ${({ theme }): string => theme.bg1};
  }
`

export const OrderNotFound: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>()

  return (
    <Wrapper>
      <Title>Order not found</Title>
      <Content>
        <p>Sorry, no matches found for: {orderId}</p>
        <Errors>
          <p>Errors:</p>
          <ErrorItem>Failed to fetch order: {orderId}</ErrorItem>
        </Errors>
        <SearchSection>
          <Title>Search again by Order ID</Title>
          <SearchContent>
            <Search />
            <p style={{ margin: 'auto 3rem' }}>or</p>
            <Support href="#">
              Get Support
              <img style={{ marginLeft: '1rem' }} src={SupportIcon} />
            </Support>
          </SearchContent>
        </SearchSection>
      </Content>
    </Wrapper>
  )
}
