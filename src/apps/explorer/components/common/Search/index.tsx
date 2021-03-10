import React, { useState } from 'react'
import { Wrapper, SearchIcon } from './Search.styled'
import { useSearchSubmit } from 'hooks/useSearchSubmit'

// assets
import searchImg from 'assets/img/search2.svg'

export const Search: React.FC = () => {
  const [query, setQuery] = useState('')
  const handleSubmit = useSearchSubmit()

  return (
    <Wrapper
      onSubmit={(e): void => {
        e.preventDefault()
        handleSubmit(query)
      }}
    >
      <button type="submit">
        <SearchIcon src={searchImg} />
      </button>
      <input
        autoComplete="off"
        type="search"
        name="query"
        value={query}
        onChange={(e): void => setQuery(e.target.value.trim())}
        placeholder="Search by order ID"
        aria-label="Search the GP explorer for orders, batches and transactions"
      />
    </Wrapper>
  )
}
