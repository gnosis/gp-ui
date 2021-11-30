import styled from 'styled-components'
import { media } from 'theme/styles/media'
import { RowWithCopyButton } from 'components/common/RowWithCopyButton'

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
  }
`

export const WrapperPage = styled(Wrapper)`
  max-width: 140rem;

  > h1 {
    padding: 2.4rem 0 0.75rem;
  }
`

export const HomeWrapper = styled(WrapperPage)`
  flex-flow: column wrap;
  justify-content: center;
  display: flex;

  > h1 {
    justify-content: center;
    padding: 2.4rem 0 0.75rem;
    width: 100%;
    margin: 0 0 2.4rem;
    font-size: 2.4rem;
    line-height: 1;
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
