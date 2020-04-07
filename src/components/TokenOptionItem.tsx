import React, { useEffect } from 'react'
import { isAddress, toChecksumAddress } from 'web3-utils'
import { TokenImgWrapper } from './TokenImg'
import { tokenListApi, exchangeApi } from 'api'
import styled from 'styled-components'
import useSafeState from 'hooks/useSafeState'
import { TokenDetails } from 'types'
import { TokenFromExchange } from 'services/factories'
import { getTokenFromErc20 } from 'services'
import { logDebug, safeFilledToken } from 'utils'
import { toast } from 'toastify'

const OptionItemWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  text-align: initial;

  img {
    width: 3.6rem;
    height: 3.6rem;
    object-fit: contain;
    margin: 0;
  }

  .tokenDetails {
    display: flex;
    justify-content: space-between;
    width: inherit;

    .tokenName {
      display: flex;
      flex-direction: column;
      margin-left: 1rem;
    }
  }

  > div > div {
    font-weight: var(--font-weight-normal);
    font-size: 1.3rem;
    color: #476481;
    line-height: 1.1;
  }

  > div > div > strong {
    font-weight: var(--font-weight-bold);
    margin: 0;
    font-size: 1.6rem;
  }
`

interface OptionItemProps {
  image?: string
  name?: string
  symbol?: string
  children?: React.ReactNode
}

// generic component to display token
// with custom children option
const OptionItemBase: React.FC<OptionItemProps> = ({ image, name, symbol, children }) => {
  return (
    <OptionItemWrapper>
      <TokenImgWrapper src={image} alt={name} />
      <div className="tokenDetails">
        <div className="tokenName">
          <div>
            <strong>{symbol}</strong>
          </div>
          <div>{name}</div>
        </div>
        {children}
      </div>
    </OptionItemWrapper>
  )
}

export const OptionItem = React.memo(OptionItemBase)

interface SearchItemProps {
  value: string
  defaultText?: string
  networkId: number
}

interface TokenAndNetwork {
  tokenAddress: string
  networkId: number
}

interface TokenDetailsAndNetwork {
  token: TokenDetails
  networkId: number
}

const addTokenToList = ({ token, networkId }: TokenDetailsAndNetwork): void => {
  tokenListApi.addToken({ token, networkId })
  const { symbol: tokenDisplayName } = safeFilledToken(token)
  toast.success(`The token ${tokenDisplayName} has been enabled for trading`)
}

type ValidResons =
  | TokenFromExchange.NOT_ERC20
  | TokenFromExchange.NOT_REGISTERED_ON_CONTRACT
  | TokenFromExchange.UNREGISTERED_ERC20

interface FetchTokenResult {
  token: TokenDetails | null
  reason: ValidResons | null
}

const fetchToken = async (params: TokenAndNetwork): Promise<FetchTokenResult> => {
  try {
    // check if registered token
    const tokenInExchange = await exchangeApi.hasToken(params)

    if (!tokenInExchange)
      return {
        token: null,
        reason: TokenFromExchange.NOT_REGISTERED_ON_CONTRACT,
      }

    // get registered id
    const tokenId = await exchangeApi.getTokenIdByAddress(params)

    // get ERC20 data
    const erc20Token = await getTokenFromErc20(params)

    if (!erc20Token)
      return {
        token: null,
        reason: TokenFromExchange.NOT_ERC20,
      }

    return {
      token: {
        ...erc20Token,
        id: tokenId,
      },
      reason: TokenFromExchange.UNREGISTERED_ERC20,
    }
  } catch (error) {
    logDebug('Error fetching token', params, error)
    return {
      token: null,
      reason: null,
    }
  }
}

// cache fetched tokens
// even between remounts
// as SearchItem will be remounted often
const fetchedCache: Record<string, FetchTokenResult | undefined> = {}
const constructCacheKey = ({ tokenAddress, networkId }: TokenAndNetwork): string => {
  return tokenAddress.toLowerCase() + '|' + networkId
}

// checks if token address is a valid address and not already in the list
const checkIfAddableAddress = (tokenAddress: string, networkId: number): boolean =>
  !tokenAddress || tokenListApi.hasToken({ tokenAddress, networkId }) || !isAddress(tokenAddress.toLowerCase())

export const SearchItem: React.FC<SearchItemProps> = ({ value, defaultText, networkId }) => {
  const [isFetching, setIsFetching] = useSafeState(false)
  // cached values can be retieved on first render already
  const [fetchResult, setFetchResult] = useSafeState<FetchTokenResult | null>(() => {
    if (!checkIfAddableAddress(value, networkId)) return null

    // check cache on mount
    // to avoid `No results` flash on remount
    const cacheKey = constructCacheKey({ tokenAddress: value, networkId })
    return fetchedCache[cacheKey] || null
  })

  useEffect(() => {
    // if truthy value, not already in the list and a valid address
    if (checkIfAddableAddress(value, networkId)) return

    // when cache is hit, token display is immediate
    const cacheKey = constructCacheKey({ tokenAddress: value, networkId })
    const cachedResult = fetchedCache[cacheKey]
    if (cachedResult) {
      setFetchResult(cachedResult)
      return
    }

    // value can change during fetch
    // then fetch result becomes stale
    let cancelled = false
    // fetching indicator on
    setIsFetching(true)

    fetchToken({ tokenAddress: toChecksumAddress(value), networkId }).then(result => {
      // cache result
      fetchedCache[cacheKey] = result
      if (!cancelled) setFetchResult(result)
      // fetching indicator off
      setIsFetching(false)
    })
    return (): void => {
      cancelled = true
      setIsFetching(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.toLowerCase(), networkId, setFetchResult])
  // don't differentiate based on case

  if (isFetching) return <>Checking token address...</>

  if (
    // if nothing fetched
    !fetchResult ||
    // or no input at all
    !value ||
    // or token in list
    // !fetchResult && guards agains race condition when updated list propagates through hooks
    (!fetchResult && tokenListApi.hasToken({ tokenAddress: value, networkId })) ||
    // or not a valid address
    !isAddress(value.toLowerCase())
  ) {
    return <>{defaultText}</>
  }

  const { token, reason } = fetchResult

  switch (reason) {
    // not registered --> advise to register
    case TokenFromExchange.NOT_REGISTERED_ON_CONTRACT:
      return <>Register token on Exchange first</>
    // not a ERC20 --> can't do much
    case TokenFromExchange.NOT_ERC20:
      return <>Not a valid ERC20 token</>
    // registered but not in list --> option to add
    case TokenFromExchange.UNREGISTERED_ERC20:
      if (!token) return <>{defaultText}</>

      const handleAddToken: React.MouseEventHandler<HTMLButtonElement> = e => {
        // prevent react-select reaction
        e.preventDefault()
        addTokenToList({ token, networkId })

        // clear cache as token is in list now
        delete fetchedCache[constructCacheKey({ tokenAddress: token.address, networkId })]
      }

      return (
        <OptionItem name={token.name} symbol={token.symbol} image={token.image}>
          <button onClick={handleAddToken}>Add Token</button>
        </OptionItem>
      )
    default:
      return <>{defaultText}</>
  }
}
