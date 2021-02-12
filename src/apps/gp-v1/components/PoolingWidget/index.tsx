/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useCallback, useMemo, useEffect } from 'react'
import { unstable_batchedUpdates as batchedUpdates } from 'react-dom'
import { Link } from 'react-router-dom'
import { toast } from 'toastify'
import styled from 'styled-components'
import joi from 'joi'

// const, type, utils
import { DEFAULT_PRECISION, LIQUIDITY_TOKEN_LIST, INPUT_PRECISION_SIZE } from 'const'
import { Receipt } from 'types'
import { TokenDex, ZERO } from '@gnosis.pm/dex-js'
import { maxAmountsForSpread, resolverFactory, VALIDATOR_ERROR_KEYS } from 'utils'

// components
import OrdersWidget from 'apps/gp-v1/components/OrdersWidget'
import { ExpandableOrdersPanel, OrdersToggler } from 'apps/gp-v1/components/TradeWidget/TradeWidget.styled'

// PoolingWidget: subcomponents
import ProgressBar from 'apps/gp-v1/components/PoolingWidget/ProgressBar'
import { StepDescription } from 'apps/gp-v1/components/PoolingWidget/StepDescriptors'
import SubComponents from 'apps/gp-v1/components/PoolingWidget/SubComponents'
import LiquidityButtons from 'apps/gp-v1/components/PoolingWidget/LiquidityButtons'
import { PoolingInterfaceWrapper } from 'apps/gp-v1/components/PoolingWidget/PoolingWidget.styled'

// Hooks and actions
import useSafeState from 'hooks/useSafeState'
import { useWalletConnection } from 'hooks/useWalletConnection'
import { usePlaceOrder, MultipleOrdersOrder } from 'hooks/usePlaceOrder'
import { useForm, FormProvider } from 'react-hook-form'
import useGlobalState from 'hooks/useGlobalState'
import { savePendingOrdersAction } from 'state/pendingOrders'

import { useTokenList } from 'hooks/useTokenList'

export const FIRST_STEP = 1
export const LAST_STEP = 2

function addRemoveMapItem(map: Map<number, TokenDex>, newToken: TokenDex): Map<number, TokenDex> {
  // Cache map (no mutate)
  const copyMap = new Map(map)
  // Map item doesn't exist? Add that fool in
  if (!copyMap.get(newToken.id)) return copyMap.set(newToken.id, newToken)
  // Else remove that b
  copyMap.delete(newToken.id)
  return copyMap
}

function setFullTokenMap(tokens: TokenDex[]): Map<number, TokenDex> {
  const tokenMap = new Map()
  tokens.forEach((token) => tokenMap.set(token.id, token))
  return tokenMap
}

// TODO: Decide the best place to put this. This file is too long already, but feels to specific for utils
export function createOrderParams(tokens: TokenDex[], spread: number): MultipleOrdersOrder[] {
  // We'll create 2 orders for each pair: SELL_A -> BUY_B and SELL_B -> BUY_A

  // With 2 tokens A, B, we have 1 pair [(A, B)] == 2 orders
  // With 3 tokens A, B, C, we have 3 pairs [(A, B), (A, C), (B, C)] == 6 orders
  // With 4 tokens A, B, C, D, we have 6 pairs [(A, B), (A, C), (A, D), (B, C), (B, D), (C, D)] == 12 orders
  // And so on...
  // The number of orders is equal to num_tokens * (num_tokens -1)
  const orders: MultipleOrdersOrder[] = []

  tokens.forEach((buyToken) =>
    tokens.forEach((sellToken) => {
      // We don't want to pair a token with itself
      if (buyToken !== sellToken) {
        // calculating buy/sell amounts
        const { buyAmount, sellAmount } = maxAmountsForSpread({
          spread,
          buyTokenPrecision: buyToken.decimals || DEFAULT_PRECISION,
          sellTokenPrecision: sellToken.decimals || DEFAULT_PRECISION,
        })

        orders.push({
          buyToken: buyToken.id,
          sellToken: sellToken.id,
          buyAmount,
          sellAmount,
        })
      }
    }),
  )

  return orders
}

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-flow: row wrap;
  font-size: inherit;
  line-height: inherit;

  overflow-y: auto;
`

const LiquidityMessage = styled.div`
  font-size: 1.3rem;
  margin: 2rem 0;
  display: flex;
  width: 100%;
  flex-flow: row wrap;
  justify-content: flex-start;
  color: var(--color-text-primary);
  background: var(--color-background-validation-warning);
  border-radius: 0 0 0.3rem 0.3rem;
  padding: 0.5rem;
  box-sizing: border-box;

  > p {
    text-align: center;
    margin: 1rem auto;
  }
`

interface PoolingFormData<T = string> {
  spread: T
}

const validationSchema = joi.object({
  spread: joi
    .number()
    .unsafe()
    .greater(0)
    .less(100)
    .precision(INPUT_PRECISION_SIZE)
    .required()
    .messages({
      [VALIDATOR_ERROR_KEYS.REQUIRED]: 'Invalid spread amount',
      [VALIDATOR_ERROR_KEYS.UNSAFE]: 'Invalid spread amount',
      [VALIDATOR_ERROR_KEYS.LESS]: 'Spread must be between 0 and 100',
      [VALIDATOR_ERROR_KEYS.GREATER]: 'Spread must be between 0 and 100',
    }),
})

const validationResolver = resolverFactory<PoolingFormData>(validationSchema)

const PoolingInterface: React.FC = () => {
  const [, dispatch] = useGlobalState()
  const [spread, setSpread] = useSafeState(0.2)
  const [step, setStep] = useSafeState(1)

  const [txHash, setTxHash] = useSafeState('')
  const [txReceipt, setTxReceipt] = useSafeState<Receipt | undefined>(undefined)
  const [txError, setTxError] = useSafeState(undefined)

  const [ordersVisible, setOrdersVisible] = useSafeState(true)

  const { networkId, networkIdOrDefault, userAddress } = useWalletConnection()
  // Get all the tokens for the current network
  const { tokens: tokenList } = useTokenList({ networkId: networkIdOrDefault })

  const tokens = useMemo(() => {
    return (
      tokenList
        // Filter out the tokens not in the list
        .filter(({ symbol }) => symbol && LIQUIDITY_TOKEN_LIST.has(symbol))
    )
  }, [tokenList])

  const [selectedTokensMap, setSelectedTokensMap] = useSafeState<Map<number, TokenDex>>(() => setFullTokenMap(tokens))

  useEffect(() => {
    setSelectedTokensMap(setFullTokenMap(tokens))
  }, [setSelectedTokensMap, tokens])

  const methods = useForm<PoolingFormData>({
    defaultValues: {
      spread: spread.toString(),
    },
    mode: 'onChange',
    resolver: validationResolver,
  })
  const { handleSubmit, watch } = methods
  // Watch input and set defaultValue to state spread
  const spreadValue = watch('spread')

  useEffect(() => {
    // only update spread on step 2
    if (step === 2) setSpread(Number(spreadValue))
  }, [setSpread, spreadValue, step])

  const prevStep = useCallback((): void => setStep((step) => (step === FIRST_STEP ? step : step - 1)), [setStep])
  const nextStep = useCallback((): void => setStep((step) => (step === LAST_STEP ? step : step + 1)), [setStep])

  const { isSubmitting, setIsSubmitting, placeMultipleOrders } = usePlaceOrder()

  const sendTransaction = useCallback(async () => {
    if (!networkId || !userAddress) return
    const orders = createOrderParams(Array.from(selectedTokensMap.values()), spread)
    try {
      setIsSubmitting(true)
      setTxReceipt(undefined)

      const { receipt } = await placeMultipleOrders({
        networkId,
        userAddress,
        orders,
        txOptionalParams: {
          onSentTransaction: (txHash: string): void => {
            setTxHash(txHash)

            const batchedOrders = orders.map(
              ({ buyToken: buyTokenId, sellToken: sellTokenId, buyAmount, sellAmount }, index) => {
                return {
                  id: `${Date.now()}_${index}`,
                  buyTokenId,
                  sellTokenId,
                  priceNumerator: buyAmount,
                  priceDenominator: sellAmount,
                  user: userAddress,
                  remainingAmount: sellAmount,
                  sellTokenBalance: ZERO,
                  validFrom: 0,
                  validUntil: 0,
                  txHash,
                  isUnlimited: true,
                }
              },
            )

            batchedUpdates(() => {
              setIsSubmitting(false)
              dispatch(savePendingOrdersAction({ orders: batchedOrders, networkId, userAddress }))
            })
          },
        },
      })

      setTxReceipt(receipt)
    } catch (e) {
      console.error('[PoolingWidget] Failed to place orders for strategy', e)
      toast.error('Not able to create your orders, please try again')

      // Error handle
      setTxError(e)
    }
  }, [
    dispatch,
    networkId,
    placeMultipleOrders,
    selectedTokensMap,
    setIsSubmitting,
    setTxError,
    setTxHash,
    setTxReceipt,
    spread,
    userAddress,
  ])

  const handleTokenSelect = useCallback(
    (token: TokenDex): void => {
      const state = addRemoveMapItem(selectedTokensMap, token)
      return setSelectedTokensMap(state)
    },
    [selectedTokensMap, setSelectedTokensMap],
  )

  const restProps = useMemo(
    () => ({
      handleTokenSelect,
      tokens,
      selectedTokensMap,
      spread,
      setSpread,
      txHash,
      txReceipt,
      txError,
      step,
      prevStep,
      nextStep,
      isSubmitting,
    }),
    [
      handleTokenSelect,
      isSubmitting,
      nextStep,
      prevStep,
      selectedTokensMap,
      setSpread,
      spread,
      step,
      tokens,
      txError,
      txHash,
      txReceipt,
    ],
  )
  return (
    <PoolingInterfaceWrapper className={ordersVisible ? '' : 'expanded'}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(sendTransaction)} noValidate>
          <h2>New Liquidity Order</h2>
          <ProgressBar step={step} stepArray={['Select Tokens', 'Define Spread & Review']} />

          <ContentWrapper>
            <StepDescription step={step} />
            {/* Main Components here */}
            <SubComponents {...restProps} />
          </ContentWrapper>

          <LiquidityMessage>
            <p>
              Your liquidity is equal to the amount you have deposited into your exchange wallet.
              <br />
              <b>
                Be sure to deposit at least one stablecoin on the <Link to="/wallet">Balances</Link> tab.
              </b>
            </p>
          </LiquidityMessage>

          {/* BUTTONS */}
          <LiquidityButtons
            handleSubmit={handleSubmit(sendTransaction)}
            disableBack={step < FIRST_STEP + 1 || selectedTokensMap.size < 2 || isSubmitting || !!txHash}
            disableContinue={(step > FIRST_STEP && !methods.formState.isValid) || selectedTokensMap.size < 2}
            disableSubmit={!!txHash || isSubmitting}
            showContinue={step !== LAST_STEP}
            showFinish={!!txReceipt}
            showLoader={isSubmitting || !!(txHash && !txReceipt)}
            showTooltipHover={selectedTokensMap.size < 2}
            {...restProps}
          />
        </form>
      </FormProvider>
      <ExpandableOrdersPanel>
        {/* Toggle panel visibility (arrow) */}
        <OrdersToggler
          type="button"
          onClick={(): void => setOrdersVisible((ordersVisible) => !ordersVisible)}
          $isOpen={ordersVisible}
        />
        {/* Actual orders content */}
        <OrdersWidget displayOnly="liquidity" />
      </ExpandableOrdersPanel>
    </PoolingInterfaceWrapper>
  )
}

export default PoolingInterface
