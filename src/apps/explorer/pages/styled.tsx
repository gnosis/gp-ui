import styled from 'styled-components'
import { media } from 'theme/styles/media'
import { RowWithCopyButton } from 'components/common/RowWithCopyButton'

export const Wrapper = styled.div`
  padding: 1.6rem;
  margin: 0 auto;
  width: 100%;

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

export const TitleAddress = styled(RowWithCopyButton)`
  font-size: ${({ theme }): string => theme.fontSizeDefault};
  font-weight: ${({ theme }): string => theme.fontNormal};
  margin: 0 0 0 1.5rem;
  display: flex;
  align-items: center;
`
