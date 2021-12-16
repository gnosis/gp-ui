import React from 'react'
import styled from 'styled-components'
import { media } from 'theme/styles/media'
import { ContentCard as Content, StyledLink, Title, Wrapper as WrapperTemplate } from 'apps/explorer/pages/styled'

const Wrapper = styled(WrapperTemplate)`
  max-width: 118rem;
  ${media.mediumDown} {
    flex-flow: column wrap;
  }

  ${media.mobile} {
    max-width: 100%;
  }
`

const NotFound2: React.FC = () => (
  <Wrapper>
    <Title>Page not found</Title>
    <Content>
      <p>We&apos;re sorry, the page you requested could not be found.</p>
      <StyledLink to="/">Back Home</StyledLink>
    </Content>
  </Wrapper>
)

export default NotFound2
