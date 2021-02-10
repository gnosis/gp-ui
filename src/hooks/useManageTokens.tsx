import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react'
import Modal, { useModal, ModalHook } from 'components/common/Modal'
import { TokenDetails } from 'types'
import styled from 'styled-components'
import { useWalletConnection } from './useWalletConnection'
import { useTokenList } from './useTokenList'
import { OptionItem, SearchItem } from 'components/TokenOptionItem'
import { useDebounce } from './useDebounce'
import searchIcon from 'assets/img/search.svg'
import { useBetterAddTokenModal, UseAddTokenModalResult } from './useBetterAddTokenModal'
import useGlobalState from 'hooks/useGlobalState'
import { GpV1AppState } from 'apps/gp-v1/state'
import { updateLocalTokens } from 'state/localTokens'
import { Toggle } from 'components/Toggle'

const OptionWrapper = styled.div`
  font-family: var(--font-default);
  text-rendering: geometricPrecision;
  line-height: 1;
  color: inherit;
  display: flex;
  font-size: inherit;
  padding: 8px 12px;
  user-select: none;
  box-sizing: border-box;
  border: 0.1rem solid var(--color-background-banner);
  align-items: center;
  min-height: 5.6rem;
  transition: background 0.2s ease-in-out;
  cursor: pointer;

  flex: 50% 0 0;

  :hover {
    background: rgba(33, 141, 255, 0.1);
  }
`

const SearchItemWrapper = styled(OptionWrapper)`
  flex-basis: 100%;

  :hover {
    background: initial;
  }
`

const TokenListWrapper = styled.div`
  max-width: 160rem;
  overflow: auto;
  height: 70vh;
  display: flex;
  flex-flow: row wrap;
  align-items: flex-start;
  align-content: flex-start;
`

interface TokenListProps {
  tokens: TokenDetails[]
  disabledTokens: Set<string>
  onToggleToken: (address: string, enabled: boolean) => void
}

const TokenList: React.FC<TokenListProps> = ({ tokens, onToggleToken, disabledTokens }) => {
  return (
    <>
      {tokens.map((token) => {
        const { name, symbol, address, addressMainnet, disabled, override } = token

        const checked = !disabledTokens.has(address)

        return (
          <OptionWrapper
            key={address}
            // allow to toggle by clicking on the whole element
            onClick={(e): void => {
              const target = e.target as HTMLElement
              //  don't preventDefault on clicks on links
              if (target.tagName === 'A' || target.parentElement?.tagName === 'A') return

              e.preventDefault() // prevents double trigger from checkbox clicks
              onToggleToken(address, !checked)
            }}
          >
            <OptionItem
              name={name}
              symbol={symbol}
              address={address}
              addressMainnet={addressMainnet}
              faded={disabled}
              warning={override?.description}
              warningUrl={override?.url}
            >
              <Toggle
                type="checkbox"
                checked={checked}
                // onChange noop prevents React warning
                onChange={(): void => void 0}
              />
            </OptionItem>
          </OptionWrapper>
        )
      })}
    </>
  )
}

const SearchWrapper = styled.div`
  display: flex;

  input {
    margin: 0;
    /* width: 100%; */
    border: 0;
    border-bottom: 0.2rem solid transparent;
    outline: 0;
    font-size: 1.4rem;
    font-weight: var(--font-weight-normal);
    background: var(--color-background-input) url(${searchIcon}) no-repeat left 1.6rem center/1.6rem;
    border-radius: 0;
    padding: 0px 1.6rem 0px 4.8rem;
    height: 3em;

    &:focus {
      border-bottom: 0.2rem solid var(--color-text-active);
      border-color: var(--color-text-active);
      color: var(--color-text-active);
    }
  }
`

type SearchInputProps = React.InputHTMLAttributes<HTMLInputElement>

const SearchInput: React.FC<SearchInputProps> = (props) => {
  return (
    <SearchWrapper>
      <input
        autoFocus
        autoCorrect="off"
        autoComplete="off"
        spellCheck="false"
        type="text"
        placeholder="Search by token Name, Symbol or Address"
        {...props}
      />
    </SearchWrapper>
  )
}

const ManageTokensContainer: React.FC = () => {
  const { networkId, networkIdOrDefault } = useWalletConnection()
  // get all tokens
  const { tokens } = useTokenList({ networkId })

  const [search, setSearch] = useState('')
  const { value: debouncedSearch, setImmediate: setDebouncedSearch } = useDebounce(search, 500)

  const { modalProps, addTokensToList } = useBetterAddTokenModal()
  const addTokensSafeModali: UseAddTokenModalResult['addTokensToList'] = useCallback(
    (...args) => {
      return addTokensToList(...args).finally(() => {
        // hack for second Modal closing
        document.body.classList.add('modali-open')
      })
    },
    [addTokensToList],
  )

  const filteredTokens = useMemo(() => {
    if (!debouncedSearch || !tokens || tokens.length === 0) return tokens

    const searchTxt = debouncedSearch.toLowerCase()

    // same search logic as in react-select
    // so partial addresses also match
    return tokens.filter(({ symbol, name, address }) => {
      return (
        symbol?.toLowerCase().includes(searchTxt) ||
        name?.toLowerCase().includes(searchTxt) ||
        address.toLowerCase().includes(searchTxt)
      )
    })
  }, [debouncedSearch, tokens])

  const tokensShown = filteredTokens.length > 0

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { value } = e.target
      setSearch(value)

      // don't debounce when looking to add token
      // for faster fetch start
      if (!tokensShown) setDebouncedSearch(value)
    },
    [tokensShown, setDebouncedSearch],
  )

  const [{ localTokens }, dispatch] = useGlobalState<GpV1AppState>()

  const [tokensDisabledState, setDisabledTokens] = useState(localTokens.disabled)
  const disabledTokensRef = useRef<typeof localTokens.disabled>(localTokens.disabled)
  // keep track to access on unmount
  disabledTokensRef.current = tokensDisabledState

  const toggleTokenState = useCallback((address: string, enabled: boolean): void => {
    setDisabledTokens((oldSet) => {
      const newDisabledSet = new Set(oldSet)

      if (enabled) newDisabledSet.delete(address)
      else newDisabledSet.add(address)

      return newDisabledSet
    })
  }, [])

  useEffect(
    () => (): void => {
      // when modal closed
      // update enabled/disabled tokens

      dispatch(updateLocalTokens({ disabled: disabledTokensRef.current }))
    },
    [dispatch],
  )

  return (
    <div>
      <SearchInput onChange={handleSearch} value={search} />
      <TokenListWrapper>
        {!tokensShown ? (
          <SearchItemWrapper>
            <SearchItem
              value={search}
              defaultText="Nothing found"
              networkId={networkIdOrDefault}
              addTokensToList={addTokensSafeModali}
            />
          </SearchItemWrapper>
        ) : (
          <TokenList tokens={filteredTokens} disabledTokens={tokensDisabledState} onToggleToken={toggleTokenState} />
        )}
      </TokenListWrapper>
      <Modal.Modal {...modalProps} />
    </div>
  )
}

interface UseManageTokensResult {
  modalProps: ModalHook
  toggleModal: () => void
}

export const useManageTokens = (): UseManageTokensResult => {
  const [modalProps, toggleModal] = useModal({
    animated: true,
    centered: true,
    title: 'Manage your Token list',
    message: <ManageTokensContainer />,
  })

  return {
    modalProps,
    toggleModal,
  }
}
