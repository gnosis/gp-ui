import styled from 'styled-components'
import * as CSS from 'csstype'
import { media } from 'theme/styles/media'

export const Navigation = styled.ol<Partial<CSS.Properties & { isActive: boolean }>>`
  list-style: none;
  display: flex;
  padding: 0;
  flex-grow: 1;
  justify-content: flex-end;

  ${media.mediumDownMd} {
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    margin: 0 0 0 auto;
    position: fixed;
    width: 100%;
    max-width: 260px;
    top: 0;
    bottom: 0;
    border-right: 1px solid var(--color-border);
    transition: left 0.2s ease-in-out;
    left: ${({ isActive }): string => (isActive ? '0' : '-260')}px;
    background-color: var(--color-primary);
    z-index: 99;
  }

  > li {
    font-size: var(--font-size-larger);
    color: var(--color-text-secondary2);
    background-color: transparent;
    transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
    border-radius: 0.75rem;
    position: relative;
    flex-flow: row;
    display: flex;
    padding: 0 15px;
    &:not(:last-child):after {
      content: '';
      display: block;
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      height: 100%;
      width: 1px;
      background-color: var(--color-text-secondary2);
      opacity: 0.6;
    }

    ${media.mediumDownMd} {
      padding: 10px 15px;
      &:not(:last-child):after {
        right: 0;
        left: 0;
        top: auto;
        bottom: 0;
        width: 100%;
        height: 1px;
        background-color: var(--color-text-secondary2);
        opacity: 0.2;
      }
    }
  }

  > li.active,
  > li:hover {
    background-color: transparent;
    color: var(--color-text-primary);
    font-weight: var(--font-weight-medium);
  }

  > li > div {
    border-radius: inherit;
  }

  > li > div > a,
  > li > a {
    font-weight: var(--font-weight-normal);
    font-size: inherit;
    color: inherit;
    text-align: center;
    text-decoration: none;
    padding: 1rem;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    position: relative;
    font-family: inherit;
    margin: 0;
    border-radius: 0.6rem;
  }

  > li > div > a > i,
  > li > a {
    transition: width 0.3s ease-in-out, background 0.3s ease-in-out;
  }
`

export const MenuBarToggle = styled.button<Partial<CSS.Properties & { isActive: boolean }>>`
  color: ${({ isActive }): string => (isActive ? 'var(--color-text-secondary1)' : 'var(--color-text-secondary2)')};
  font-size: 17px;
  padding: 5px 10px;
  border: 1px solid ${({ isActive }): string => (isActive ? 'var(--color-text-secondary2)' : 'var(--color-border)')};
  display: none;
  background-color: transparent;
  background-image: none;
  margin-left: auto;
  ${media.mediumDownMd} {
    display: flex;
  }
`
