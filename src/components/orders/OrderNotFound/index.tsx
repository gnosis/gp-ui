import React from 'react'
import { useParams } from 'react-router'
import styled from 'styled-components'
import { Search } from 'components/orders/Search'
import SupportIcon from 'assets/img/support.png'

const Wrapper = styled.div`
  font-size: 14px;
`

const Title = styled.p`
  font-size: 16px;
  font-weight: 600;
`

const Content = styled.div`
  font-size: 14px;
  border: 1px solid #777;
  padding: 1rem;
`

const Errors = styled.div`
  border-radius: 4px;
  padding: 1rem 1rem 2rem;
  background: #333;
  margin-top: 3rem;
  width: 600px;
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

const Support = styled.div`
  height: 5rem;
  border: 1px solid #777;
  border-radius: 4px;
  width: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const OrderNotFound: React.FC = () => {
  const params: any = useParams()

  return (
    <Wrapper>
      <Title>Order not found</Title>
      <Content>
        <p>Sorry, no matches found for: {params.orderId}</p>
        <Errors>
          <p>Errors:</p>
          <ErrorItem>Failed to fetch order: {params.orderId}</ErrorItem>
        </Errors>
        <SearchSection>
          <Title>Search again by Order ID</Title>
          <SearchContent>
            <Search />
            <p style={{ margin: 'auto 3rem' }}>Or</p>
            <Support>
              Get Support
              <img style={{ marginLeft: '1rem' }} src={SupportIcon} />
            </Support>
          </SearchContent>
        </SearchSection>
      </Content>
    </Wrapper>
  )
}
