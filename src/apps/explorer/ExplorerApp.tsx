import React from 'react'
import { BrowserRouter, HashRouter, Route, Switch, Link } from 'react-router-dom'
import { hot } from 'react-hot-loader/root'

import { withGlobalContext } from 'hooks/useGlobalState'
import useNetworkCheck from 'hooks/useNetworkCheck'
import Console from 'Console'
import { GlobalModalInstance } from 'components/OuterModal'
import { rootReducer, INITIAL_STATE } from 'apps/explorer/state'

import { GenericLayout } from 'components/layout'
import { Navigation } from 'components/layout/GenericLayout/Navigation'
import { Header } from 'components/layout/GenericLayout/Header'
import { UpdateNetwork } from 'state/network'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Router: typeof BrowserRouter & typeof HashRouter = (window as any).IS_IPFS ? HashRouter : BrowserRouter

const NotFound = React.lazy(
  () =>
    import(
      /* webpackChunkName: "Extra_routes_chunk"*/
      './pages/NotFound'
    ),
)

const Home = React.lazy(
  () =>
    import(
      /* webpackChunkName: "Trade_chunk"*/
      './pages/Home'
    ),
)

const Order = React.lazy(
  () =>
    import(
      /* webpackChunkName: "Order_chunk"*/
      './pages/Order'
    ),
)

const HEADER = (
  <Header>
    <Navigation>
      <li>
        <Link to="/">Batches</Link>
      </li>
      <li>
        <Link to="/trades">Trades</Link>
      </li>
      <li>
        <Link to="/markets">Markets</Link>
      </li>
    </Navigation>
  </Header>
)

export const Updaters: React.FC = () => {
  return (
    <>
      <UpdateNetwork />
    </>
  )
}

export const ExplorerApp: React.FC = () => {
  // Deal with incorrect network
  useNetworkCheck()

  return (
    <>
      <Router basename={process.env.BASE_URL}>
        <Updaters />
        <GenericLayout header={HEADER}>
          <React.Suspense fallback={null}>
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/network/:orderId" exact component={Order} />
              <Route path="/orders/:orderId" exact component={Order} />
              <Route component={NotFound} />
            </Switch>
          </React.Suspense>
        </GenericLayout>
        {GlobalModalInstance}
      </Router>
      {process.env.NODE_ENV === 'development' && <Console />}
    </>
  )
}

export default hot(
  withGlobalContext(
    ExplorerApp,
    // Initial State
    INITIAL_STATE,
    rootReducer,
  ),
)
