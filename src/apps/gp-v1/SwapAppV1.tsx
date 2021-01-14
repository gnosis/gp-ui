import React from 'react'
import { BrowserRouter, HashRouter, Route, Switch, Redirect } from 'react-router-dom'

import { hot } from 'react-hot-loader/root'
import { encodeSymbol } from '@gnosis.pm/dex-js'

import { withGlobalContext } from 'hooks/useGlobalState'
import PrivateRoute from 'PrivateRoute'
import GlobalStyles from 'styles/global'
import { assertNonNull } from 'utils'
import useNetworkCheck from 'hooks/useNetworkCheck'
import { ToastContainer } from 'setupToastify'
import Console from 'Console'
import { GlobalModalInstance } from 'components/OuterModal'
import { LegacyTradeLayout } from 'components/layout'
import { rootReducer, INITIAL_STATE } from 'reducers-actions'

// Pages
const About = React.lazy(
  () =>
    import(
      /* webpackChunkName: "Extra_routes_chunk"*/
      './pages/About'
    ),
)

const Trade = React.lazy(
  () =>
    import(
      /* webpackChunkName: "Trade_chunk"*/
      './pages/Trade'
    ),
)

const Trades = React.lazy(
  () =>
    import(
      /* webpackChunkName: "Trade_chunk"*/
      './pages/Trades'
    ),
)

const Strategies = React.lazy(
  () =>
    import(
      /* webpackChunkName: "Strategies_chunk"*/
      './pages/Strategies'
    ),
)

const Orders = React.lazy(
  () =>
    import(
      /* webpackChunkName: "Orders_chunk"*/
      './pages/Orders'
    ),
)

const Wallet = React.lazy(
  () =>
    import(
      /* webpackChunkName: "Wallet_chunk"*/
      './pages/Wallet'
    ),
)

const NotFound = React.lazy(
  () =>
    import(
      /* webpackChunkName: "Extra_routes_chunk"*/
      './pages/NotFound'
    ),
)

const ConnectWallet = React.lazy(
  () =>
    import(
      /* webpackChunkName: "Extra_routes_chunk"*/
      './pages/ConnectWallet'
    ),
)
const FAQ = React.lazy(
  () =>
    import(
      /* webpackChunkName: "Extra_routes_chunk"*/
      './pages/FAQ'
    ),
)
const OrderBook = React.lazy(
  () =>
    import(
      /* webpackChunkName: "OrderBook_chunk"*/
      './pages/OrderBook'
    ),
)
const Settings = React.lazy(
  () =>
    import(
      /* webpackChunkName: "Settings_chunk"*/
      './pages/Settings'
    ),
)

function getInitialUrl(): string {
  assertNonNull(CONFIG.initialTokenSelection, 'initialTokenSelection config is required')
  const { sellToken: initialSellToken, receiveToken: initialReceiveToken } = CONFIG.initialTokenSelection
  assertNonNull(initialSellToken, 'sellToken is required in the initialTokenSelection config')
  assertNonNull(initialReceiveToken, 'receiveToken is required in the initialTokenSelection config')
  return '/trade/' + encodeSymbol(initialReceiveToken) + '-' + encodeSymbol(initialSellToken) + '?sell=0&price=0'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Router: typeof BrowserRouter & typeof HashRouter = (window as any).IS_IPFS ? HashRouter : BrowserRouter
const initialUrl = getInitialUrl()

export const SwapAppV1: React.FC = () => {
  // Deal with incorrect network
  useNetworkCheck()

  return (
    <>
      <Router basename={process.env.BASE_URL}>
        <LegacyTradeLayout>
          <GlobalStyles />
          <ToastContainer />
          <React.Suspense fallback={null}>
            <Switch>
              <PrivateRoute path="/orders" exact component={Orders} />
              <Route path="/trade/:buy-:sell" component={Trade} />
              <PrivateRoute path="/liquidity" exact component={Strategies} />
              <PrivateRoute path="/wallet" exact component={Wallet} />
              <Route path="/about" exact component={About} />
              <Route path="/faq" exact component={FAQ} />
              <Route path="/book" exact component={OrderBook} />
              <Route path="/connect-wallet" exact component={ConnectWallet} />
              <Route path="/trades" exact component={Trades} />
              <Route path="/settings" exact component={Settings} />
              <Redirect from="/" to={initialUrl} />
              <Route component={NotFound} />
            </Switch>
          </React.Suspense>
        </LegacyTradeLayout>
        {GlobalModalInstance}
      </Router>
      {process.env.NODE_ENV === 'development' && <Console />}
    </>
  )
}

export default hot(
  withGlobalContext(
    SwapAppV1,
    // Initial State
    INITIAL_STATE,
    rootReducer,
  ),
)
