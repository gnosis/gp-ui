import styled from 'styled-components'

export const Navigation = styled.ol`
  list-style: none;
  display: flex;
  padding: 0;

  > li {
    font-size: var(--font-size-larger);
    color: var(--color-text-secondary2);
    background-color: transparent;
    transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
    border-radius: 0.75rem;
    position: relative;
    flex-flow: row;
    display: flex;
  }

  > li.active,
  > li:hover {
    background-color: var(--color-gradient-2);
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