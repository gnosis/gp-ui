import React, { useMemo } from 'react'
import { logDebug, formatDateLocaleShortTime, getMarket } from 'utils'
import { useFormContext } from 'react-hook-form'
import { TokenDetails } from 'types'
import styled from 'styled-components'
import { TradeFormData } from '.'
import { displayTokenSymbolOrLink, symbolOrAddress } from 'utils/display'

import { HelpTooltip, HelpTooltipContainer } from 'components/Tooltip'

import useSafeState from 'hooks/useSafeState'
import { usePriceEstimationWithSlippage, usePriceEstimationInOwl, useWETHPriceInOwl } from 'hooks/usePriceEstimation'
import { useMinTradableAmountInOwl } from 'hooks/useMinTradableAmountInOwl'
import usePriceImpact from 'components/trade/PriceImpact/usePriceImpact'
import { useGasPrice } from 'hooks/useGasPrice'

import BigNumber from 'bignumber.js'
import { ZERO_BIG_NUMBER } from 'const'

import alertIcon from 'assets/img/alert.svg'
import { DEFAULT_GAS_PRICE, ROUND_TO_NUMBER, roundToNext } from 'utils/minFee'
import { parseAmount, formatAmount } from '@gnosis.pm/dex-js'
import { SwapPrice } from 'components/common/SwapPrice'
import { SimplePriceImpact } from 'components/trade/PriceImpact'

interface TxMessageProps {
  sellToken: TokenDetails
  receiveToken: TokenDetails
  networkId: number
}

const TxMessageWrapper = styled.div`
  padding: 1em;

  > div.message {
    div.sectionTitle {
      margin-bottom: 0.2rem;
      &:not(:first-of-type) {
        margin-top: 1rem;
      }
    }

    div:not(.sectionTitle) {
      margin-left: 1rem;
    }
  }
  a.showMoreAnchor {
    color: rgb(33, 141, 255);
    font-size: 1.2rem;
    margin-left: 0.2rem;
  }
`
const ReceiveTooltip: React.FC<{ amount: string; buyToken: string | React.ReactNode; linkURL?: string }> = ({
  amount,
  linkURL = 'https://docs.gnosis.io/protocol/',
  buyToken,
}) => (
  <HelpTooltipContainer>
    You will receive at least {amount} {buyToken} if your order is completely executed. <br />
    ⚠️ Please remember that your order can be also partially executed, or not executed at all. <br />
    Read more about how Gnosis Protocol works{' '}
    <a target="_blank" rel="noreferrer" href={linkURL}>
      here
    </a>
    .
  </HelpTooltipContainer>
)

const OrderValidityTooltip: React.FC = () => (
  <HelpTooltipContainer>
    ⚠️ Learn more about the validity of orders in the Gnosis Protocol{' '}
    <a target="_blank" rel="noreferrer" href="https://docs.gnosis.io/protocol/docs/intro-batches/#orders">
      here
    </a>
    .
  </HelpTooltipContainer>
)

interface SimpleDisplayPriceProps {
  price: string
  priceInverse: string
  baseToken: TokenDetails
  quoteToken: TokenDetails
}

export const SimpleDisplayPrice: React.FC<SimpleDisplayPriceProps> = ({
  price,
  priceInverse,
  baseToken,
  quoteToken,
}) => {
  const [isPriceInverted, setPriceInverted] = useSafeState(false)
  const swapPrices = (): void => setPriceInverted((state) => !state)

  return (
    <div>
      <span>{isPriceInverted ? priceInverse : price}</span>{' '}
      <SwapPrice
        baseToken={baseToken}
        quoteToken={quoteToken}
        isPriceInverted={isPriceInverted}
        onSwapPrices={swapPrices}
        showBaseToken
      />
    </div>
  )
}

const Warning = styled.div`
  position: relative;
  display: flex;
  background: var(--color-background-deleteOrders);
  margin: 1rem;
  padding: 1rem;
  border-radius: 0.3em;

  a {
    color: var(--color-text-active);
  }

  > div {
    width: 94%;
  }

  div.warningContainer {
    margin-top: 0.5rem;
  }

  .alert {
    width: 5.2%;
    opacity: 0.4;
    align-self: center;
  }
`

interface LowVolumeParams {
  sellToken: TokenDetails
  networkId: number
  sellTokenAmount: string
}

interface LowVolumeResult {
  isLoading: boolean
  isLowVolume?: boolean
  difference?: BigNumber
  minAmount?: BigNumber
  roundedUpAmount?: BigNumber
  roundedUpTo?: number
  roundedUpAmountInOwl?: BigNumber
}

const useLowVolumeAmount = ({ sellToken, sellTokenAmount, networkId }: LowVolumeParams): LowVolumeResult => {
  const { priceEstimation, isPriceLoading } = usePriceEstimationInOwl({
    tokenId: sellToken.id,
    tokenDecimals: sellToken.decimals,
    networkId,
  })

  const { priceEstimation: wethPriceInOwl, isPriceLoading: isWETHPriceLoading } = useWETHPriceInOwl(networkId)

  const gasPrice = useGasPrice({ defaultGasPrice: DEFAULT_GAS_PRICE, gasPriceLevel: 'fast' })

  const minTradableAmountInOwl = useMinTradableAmountInOwl(networkId)

  return useMemo(() => {
    if (priceEstimation !== null && priceEstimation.isZero()) {
      // no price data for token
      logDebug('No priceEstimation data for', sellToken.symbol, 'in OWL')

      return { isLoading: false, isLowVolume: false }
    }

    if (
      isPriceLoading ||
      isWETHPriceLoading ||
      priceEstimation === null ||
      wethPriceInOwl === null ||
      gasPrice === null ||
      minTradableAmountInOwl === null
    ) {
      return { isLoading: true }
    }

    logDebug('priceEstimation of', sellToken.symbol, 'in OWL', priceEstimation.toString(10))
    logDebug('WETH price in OWL', wethPriceInOwl.toString(10))

    const minTradableAmountInOwlRoundedUp = roundToNext(minTradableAmountInOwl)

    const minTradableAmountPerToken = minTradableAmountInOwl.dividedBy(priceEstimation)
    const isLowVolume = minTradableAmountPerToken.isGreaterThan(sellTokenAmount)

    const roundedUpAmount = minTradableAmountInOwlRoundedUp.dividedBy(priceEstimation)

    const difference = isLowVolume ? minTradableAmountPerToken.minus(sellTokenAmount) : ZERO_BIG_NUMBER

    logDebug({
      isLowVolume,
      difference: difference.toString(10),
      minAmount: minTradableAmountPerToken.toString(10),
      minAmountInOWL: minTradableAmountInOwl.toString(10),
      gasPrice,
      roundedUpAmount: roundedUpAmount.toString(10),
      roundedUpAmountInOwl: minTradableAmountInOwlRoundedUp.toString(10),
    })
    return {
      isLowVolume,
      difference,
      isLoading: false,
      minAmount: minTradableAmountPerToken,
      roundedUpAmount: roundedUpAmount,
      roundedUpTo: ROUND_TO_NUMBER,
      roundedUpAmountInOwl: minTradableAmountInOwlRoundedUp,
    }
  }, [
    isPriceLoading,
    priceEstimation,
    sellToken.symbol,
    sellTokenAmount,
    gasPrice,
    isWETHPriceLoading,
    wethPriceInOwl,
    minTradableAmountInOwl,
  ])
}

export const TxMessage: React.FC<TxMessageProps> = ({ sellToken, receiveToken, networkId }) => {
  const [orderHelpVisible, showOrderHelp] = useSafeState(false)
  const { getValues } = useFormContext<TradeFormData>()
  const {
    price,
    priceInverse,
    validFrom,
    validUntil,
    sellToken: sellTokenAmount,
    receiveToken: receiveTokenAmount,
  } = getValues()
  const displaySellToken = displayTokenSymbolOrLink(sellToken)
  const displayReceiveToken = displayTokenSymbolOrLink(receiveToken)

  const {
    isLoading,
    isLowVolume,
    roundedUpAmount: recommendedAmount,
    roundedUpAmountInOwl: roundedAmountInUSD,
  } = useLowVolumeAmount({
    sellToken,
    networkId,
    sellTokenAmount,
  })

  const { formattedAmount = '', amountInUSD = '' } = useMemo<{ formattedAmount?: string; amountInUSD?: string }>(() => {
    if (!recommendedAmount || !roundedAmountInUSD) return {}

    const parsedAmount = parseAmount(recommendedAmount.toString(10), sellToken.decimals)
    const parseAmountInUSD = parseAmount(roundedAmountInUSD.toString(10), 1)

    if (!parsedAmount || !parseAmountInUSD) return {}

    const amountFull = formatAmount({ amount: parsedAmount, precision: sellToken.decimals, decimals: 2 })
    const amountInUSD = formatAmount({ amount: parseAmountInUSD, precision: 1 })

    return { formattedAmount: amountFull, amountInUSD }
  }, [recommendedAmount, roundedAmountInUSD, sellToken.decimals])

  // Get canonical market
  const { baseToken, quoteToken } = useMemo(() => getMarket({ receiveToken, sellToken }), [receiveToken, sellToken])

  const { priceEstimation: fillPrice } = usePriceEstimationWithSlippage({
    baseTokenId: receiveToken.id,
    baseTokenDecimals: receiveToken.decimals,
    quoteTokenId: sellToken.id,
    quoteTokenDecimals: sellToken.decimals,
    amount: sellTokenAmount,
    networkId,
  })

  const { priceImpactSmart, priceImpactClassName, priceImpactWarning } = usePriceImpact({
    networkId,
    limitPrice: sellToken === quoteToken ? price : priceInverse,
    fillPrice,
    baseToken: receiveToken,
    quoteToken: sellToken,
  })

  const renderWarnings = React.useCallback(() => {
    if (!isLoading) {
      return (
        <>
          {isLowVolume && (
            <Warning>
              <div>
                <strong>Low Volume Alert</strong>
                <div className="warningContainer">
                  This is a low volume order. We recommend selling at least{' '}
                  <strong>
                    {formattedAmount} {symbolOrAddress(sellToken)}
                  </strong>{' '}
                  (approximately <strong>${amountInUSD}</strong>) of the token.
                </div>
                <p>
                  Please keep in mind that solvers may not include your order if it does not generate enough fees to pay
                  their running costs. Learn more{' '}
                  <a
                    href="https://docs.gnosis.io/protocol/docs/faq#minimum-order"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    here
                  </a>
                  .
                </p>
              </div>
              <img className="alert" src={alertIcon} />
            </Warning>
          )}
          {priceImpactWarning && (
            <Warning>
              <div style={{ flexFlow: 'column' }}>
                <strong>Price Alert</strong>
                <div className="warningContainer">{priceImpactWarning}</div>
              </div>
              <img className="alert" src={alertIcon} />
            </Warning>
          )}
        </>
      )
    }

    return null
  }, [amountInUSD, formattedAmount, isLoading, isLowVolume, priceImpactWarning, sellToken])

  return (
    <TxMessageWrapper>
      <div className="intro-text">
        <div>Carefully review the information below to make sure everything looks correct.</div>
      </div>
      <div>
        How is the order executed?
        <a className="showMoreAnchor" onClick={(): void => showOrderHelp(!orderHelpVisible)}>
          {orderHelpVisible ? '[-] Show less...' : '[+] Show more...'}
        </a>
        {orderHelpVisible && (
          <>
            <ul>
              <li>
                After confirming and sending the transaction, your order will be active during the specified validity
                time.
              </li>
              <li>
                During that time, it will be matched against other orders as long as there is an overlap in the limit
                prices.
              </li>
              <li>
                The limit price specified in this order will be respected, and{' '}
                <strong>no fee will be applied on top of it</strong>.
              </li>
              <li>You can cancel the order at any point after its creation.</li>
            </ul>
            <p>
              Check{' '}
              <a href="https://docs.gnosis.io/protocol/" target="_blank" rel="noreferrer">
                here
              </a>{' '}
              for more information on Gnosis Protocol.
            </p>
          </>
        )}
      </div>
      <div className="message">
        {/* Details */}
        <div className="sectionTitle">
          <strong>Order Details</strong>
        </div>
        <div>
          Sell: <span>{sellTokenAmount}</span> <strong>{displaySellToken}</strong>
        </div>
        <div>
          Receive: {receiveTokenAmount} <strong>{displayReceiveToken}</strong>{' '}
          <HelpTooltip tooltip={<ReceiveTooltip amount={receiveTokenAmount} buyToken={displayReceiveToken} />} />
        </div>

        {/* Prices */}
        <div className="sectionTitle">
          <strong>Prices</strong>
        </div>
        <SimpleDisplayPrice baseToken={baseToken} quoteToken={quoteToken} price={price} priceInverse={priceInverse} />

        {/* Price Impact */}
        <div className="sectionTitle">
          <strong>Price Impact</strong>
        </div>
        <div>
          Percentage: <SimplePriceImpact className={priceImpactClassName} impactAmount={priceImpactSmart} />
        </div>
        {/* Order Validity */}
        <div className="sectionTitle">
          <strong>Order Validity Details</strong> <HelpTooltip tooltip={<OrderValidityTooltip />} />
        </div>
        <div>
          Starts: <span>{validFrom ? formatDateLocaleShortTime(+validFrom) : 'Now'}</span>
        </div>
        <div>
          Expires: <span>{validUntil ? formatDateLocaleShortTime(+validUntil) : 'Never'}</span>
        </div>
      </div>
      {renderWarnings()}
    </TxMessageWrapper>
  )
}
