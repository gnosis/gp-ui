import styled from 'styled-components'
import { media } from 'theme/styles/media'
import { RowWithCopyButton } from 'components/common/RowWithCopyButton'
import { Link } from 'react-router-dom'

export const Wrapper = styled.div`
  padding: 1.6rem;
  margin: 0 auto;
  width: 100%;
  flex-grow: 1;

  ${media.mediumDown} {
    max-width: 94rem;
  }

  ${media.mobile} {
    max-width: 100%;
  }

  > h1 {
    display: flex;
    padding: 2.4rem 0 2.35rem;
    align-items: center;
    font-weight: ${({ theme }): string => theme.fontBold};
    margin: 0;
  }
`

export const TitleAddress = styled(RowWithCopyButton)`
  font-size: ${({ theme }): string => theme.fontSizeDefault};
  font-weight: ${({ theme }): string => theme.fontNormal};
  margin: 0 0 0 1.5rem;
  display: flex;
  align-items: center;
  ${media.tinyDown} {
    font-size: 1.2rem;
  }
`

export const StyledLink = styled(Link)`
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

export const Title = styled.h1`
  margin: 3rem 0 2.95rem;
  font-weight: ${({ theme }): string => theme.fontBold};
`

export const ContentCard = styled.div`
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
