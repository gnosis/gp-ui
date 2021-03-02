import React from 'react'
import styled from 'styled-components'

export type Props = {
  percentage?: string | null
  activeColor?: string
}

const Wrapper = styled.div<Props>`
  display: flex;
  align-items: center;

  > div {
    width: 16rem;
    height: 0.6rem;
    position: relative;
    border-radius: 16rem;
    background: ${({ theme }): string => theme.borderPrimary};
  }

  > div > span {
    width: ${({ percentage }): string => percentage || '0'}%;
    max-width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background-color: ${({ activeColor, theme }): string => (activeColor ? activeColor : theme.green)};
    border-radius: 16rem;
  }
`

export function ProgressBar(props: Props): JSX.Element {
  return (
    <Wrapper {...props}>
      <div>
        <span></span>
      </div>
    </Wrapper>
  )
}
